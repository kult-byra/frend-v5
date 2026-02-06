"use server";

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getMigrationDir } from "@/lib/storyblok/migration-fs";
import {
  clearIdMapCache,
  clearTranslationCache,
  type PersonTransformResult,
  personSanityId,
  type StoryblokPersonStory,
  transformPerson,
} from "@/lib/storyblok/transforms/person.transform";
import { getSanityWriteClient, isSanityWriteConfigured } from "@/server/sanity/sanity-write-client";

// ---------- Config Check ----------

export type SanityWriteConfigCheck = { configured: true } | { configured: false; message: string };

export async function checkSanityWriteConfig(): Promise<SanityWriteConfigCheck> {
  if (!isSanityWriteConfigured()) {
    return {
      configured: false,
      message: "Missing SANITY_API_WRITE_TOKEN in .env.local",
    };
  }
  return { configured: true };
}

// ---------- Import Status (persisted for incremental sync) ----------

export type PersonImportStatus = {
  lastImportStarted: string;
  lastImportCompleted: string;
  importedSlugs: string[];
  importedImages: Record<string, string>; // slug → Storyblok image URL
};

function getImportStatusPath(): string {
  return join(getMigrationDir(), "id-maps", "person-import-status.json");
}

function readImportStatus(): PersonImportStatus | null {
  const path = getImportStatusPath();
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as PersonImportStatus;
}

function writeImportStatus(status: PersonImportStatus): void {
  const dir = join(getMigrationDir(), "id-maps");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(getImportStatusPath(), JSON.stringify(status, null, 2), "utf-8");
}

export async function getPersonImportStatus(): Promise<PersonImportStatus | null> {
  return readImportStatus();
}

// ---------- Preview ----------

export type ChangeType = "new" | "updated" | "unchanged" | "deleted";

export type PreviewItem = {
  slug: string;
  name: string;
  roleNo: string;
  roleEn: string;
  email: string | null;
  phone: string | null;
  hasImage: boolean;
  sanityId: string;
  externalPerson: boolean;
  company: string | null;
  changeType: ChangeType;
  warnings: string[];
};

export type PreviewResult = {
  total: number;
  changed: number;
  unchanged: number;
  deleted: number;
  items: PreviewItem[];
};

function getPersonDir(): string {
  return join(getMigrationDir("stories"), "Person");
}

function readPersonFiles(): StoryblokPersonStory[] {
  const dir = getPersonDir();
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = readFileSync(join(dir, file), "utf-8");
    return JSON.parse(raw) as StoryblokPersonStory;
  });
}

function classifyChange(
  story: StoryblokPersonStory,
  imageUrl: string | null,
  status: PersonImportStatus | null,
): ChangeType {
  if (!status) return "new";
  const wasPreviouslyImported = status.importedSlugs.includes(story.slug);
  if (!wasPreviouslyImported) return "new";

  // Check if story was updated after last import
  if (story.updated_at && status.lastImportCompleted) {
    if (new Date(story.updated_at) > new Date(status.lastImportCompleted)) {
      return "updated";
    }
  }

  // Check if image URL changed
  const previousImageUrl = status.importedImages[story.slug];
  if ((imageUrl ?? "") !== (previousImageUrl ?? "")) {
    return "updated";
  }

  return "unchanged";
}

export async function previewPersonImport(): Promise<PreviewResult> {
  clearTranslationCache();
  clearIdMapCache();
  const stories = readPersonFiles();
  const importStatus = readImportStatus();

  const currentSlugs = new Set(stories.map((s) => s.slug));

  const items: PreviewItem[] = stories.map((story) => {
    const result = transformPerson(story);
    const changeType = classifyChange(story, result.imageUrl, importStatus);
    return {
      slug: result.slug,
      name: result.document.name,
      roleNo: result.document.role_no,
      roleEn: result.document.role_en,
      email: result.document.email ?? null,
      phone: result.document.phone ?? null,
      hasImage: !!result.imageUrl,
      sanityId: result.document._id,
      externalPerson: result.document.externalPerson,
      company: result.document.company ?? null,
      changeType,
      warnings: result.warnings,
    };
  });

  // Detect deletions: slugs that were previously imported but no longer on disk
  if (importStatus) {
    for (const slug of importStatus.importedSlugs) {
      if (!currentSlugs.has(slug)) {
        items.push({
          slug,
          name: slug,
          roleNo: "",
          roleEn: "",
          email: null,
          phone: null,
          hasImage: false,
          sanityId: personSanityId(slug),
          externalPerson: false,
          company: null,
          changeType: "deleted",
          warnings: ["Will be deleted from Sanity"],
        });
      }
    }
  }

  const changed = items.filter((i) => i.changeType === "new" || i.changeType === "updated").length;
  const unchanged = items.filter((i) => i.changeType === "unchanged").length;
  const deleted = items.filter((i) => i.changeType === "deleted").length;

  return { total: items.length, changed, unchanged, deleted, items };
}

// ---------- Import ----------

export type ImportMode = "full" | "incremental";

export type ImportPersonResult = {
  slug: string;
  sanityId: string;
  status: "created" | "replaced" | "skipped" | "deleted" | "error";
  imageUploaded: boolean;
  error?: string;
  warnings: string[];
};

export type ImportResult =
  | {
      success: true;
      mode: ImportMode;
      total: number;
      created: number;
      replaced: number;
      skipped: number;
      deleted: number;
      errors: number;
      results: ImportPersonResult[];
    }
  | { success: false; error: string };

export async function importPersonsToSanity(mode: ImportMode = "full"): Promise<ImportResult> {
  try {
    const client = getSanityWriteClient();
    const stories = readPersonFiles();

    if (stories.length === 0) {
      return { success: false, error: "No Person data found in migration-data/stories/Person/" };
    }

    clearTranslationCache();
    clearIdMapCache();

    const importStatus = readImportStatus();
    const importStarted = new Date().toISOString();

    // Check which documents already exist in Sanity
    const allIds = stories.map((s) => personSanityId(s.slug));
    const existingDocs = await client.fetch<string[]>(`*[_type == "person" && _id in $ids]._id`, {
      ids: allIds,
    });
    const existingSet = new Set(existingDocs);

    const results: ImportPersonResult[] = [];
    let created = 0;
    let replaced = 0;
    let skipped = 0;
    let deleted = 0;
    let errors = 0;

    // Track images for this import
    const newImportedImages: Record<string, string> = {};

    for (const story of stories) {
      let transformResult: PersonTransformResult;
      try {
        transformResult = transformPerson(story);
      } catch (err) {
        errors++;
        results.push({
          slug: story.slug,
          sanityId: "",
          status: "error",
          imageUploaded: false,
          error: `Transform failed: ${err instanceof Error ? err.message : String(err)}`,
          warnings: [],
        });
        continue;
      }

      const { document, imageUrl, slug, warnings } = transformResult;

      // In incremental mode, skip unchanged items
      if (mode === "incremental") {
        const changeType = classifyChange(story, imageUrl, importStatus);
        if (changeType === "unchanged") {
          skipped++;
          // Carry forward the previous image URL
          if (importStatus?.importedImages[slug]) {
            newImportedImages[slug] = importStatus.importedImages[slug];
          }
          results.push({
            slug,
            sanityId: document._id,
            status: "skipped",
            imageUploaded: false,
            warnings: [],
          });
          continue;
        }
      }

      let imageUploaded = false;

      // Upload image — skip if URL unchanged in incremental mode
      if (imageUrl) {
        const imageUnchanged =
          mode === "incremental" && importStatus?.importedImages[slug] === imageUrl;

        if (imageUnchanged) {
          // Image URL same as before, no need to re-upload
          warnings.push("Image unchanged, skipped re-upload");
        } else {
          try {
            const imageResponse = await fetch(imageUrl, { cache: "no-store" });
            if (imageResponse.ok) {
              const buffer = Buffer.from(await imageResponse.arrayBuffer());
              const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
              const filename = imageUrl.split("/").pop() ?? `person-${slug}.jpg`;

              const asset = await client.assets.upload("image", buffer, {
                filename,
                contentType,
              });

              document.media = {
                _type: "media",
                mediaType: "image",
                image: {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: asset._id,
                  },
                },
              };
              imageUploaded = true;
            } else {
              warnings.push(`Image download failed: HTTP ${imageResponse.status}`);
            }
          } catch (err) {
            warnings.push(
              `Image upload failed: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }

        newImportedImages[slug] = imageUrl;
      }

      // Create or replace the document
      try {
        await client.createOrReplace(document);
        const isReplace = existingSet.has(document._id);
        if (isReplace) {
          replaced++;
        } else {
          created++;
        }
        results.push({
          slug,
          sanityId: document._id,
          status: isReplace ? "replaced" : "created",
          imageUploaded,
          warnings,
        });
      } catch (err) {
        errors++;
        results.push({
          slug,
          sanityId: document._id,
          status: "error",
          imageUploaded,
          error: `Sanity mutation failed: ${err instanceof Error ? err.message : String(err)}`,
          warnings,
        });
      }

      // Delay between items to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Handle deletions: persons previously imported but no longer on disk
    if (importStatus) {
      const currentSlugs = new Set(stories.map((s) => s.slug));
      for (const slug of importStatus.importedSlugs) {
        if (!currentSlugs.has(slug)) {
          const sanityId = personSanityId(slug);
          try {
            await client.delete(sanityId);
            deleted++;
            results.push({
              slug,
              sanityId,
              status: "deleted",
              imageUploaded: false,
              warnings: [],
            });
          } catch (err) {
            errors++;
            results.push({
              slug,
              sanityId,
              status: "error",
              imageUploaded: false,
              error: `Delete failed: ${err instanceof Error ? err.message : String(err)}`,
              warnings: [],
            });
          }
        }
      }
    }

    // Persist import status
    writeImportStatus({
      lastImportStarted: importStarted,
      lastImportCompleted: new Date().toISOString(),
      importedSlugs: stories.map((s) => s.slug),
      importedImages: newImportedImages,
    });

    return {
      success: true,
      mode,
      total: stories.length,
      created,
      replaced,
      skipped,
      deleted,
      errors,
      results,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error during import",
    };
  }
}
