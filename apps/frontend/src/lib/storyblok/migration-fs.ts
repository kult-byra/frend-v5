import "server-only";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import type { StoryblokSpace, StoryblokStoryFull } from "./storyblok.types";

const MIGRATION_DIR = join(process.cwd(), "../../migration-data");

export type MigrationResource = "components" | "stories" | "assets" | "datasources";

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function getMigrationDir(resource?: MigrationResource): string {
  const dir = resource ? join(MIGRATION_DIR, resource) : MIGRATION_DIR;
  ensureDir(dir);
  return dir;
}

export function writeResourceFile(resource: MigrationResource, filename: string, data: unknown) {
  const dir = getMigrationDir(resource);
  writeFileSync(join(dir, filename), JSON.stringify(data, null, 2), "utf-8");
}

export function readResourceFile<T>(resource: MigrationResource, filename: string): T | null {
  const filePath = join(getMigrationDir(resource), filename);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export function listResourceFiles(resource: MigrationResource): string[] {
  const dir = getMigrationDir(resource);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".json"));
}

// ---- Download Status ----

export type SyncStats = {
  newItems: number;
  updatedItems: number;
  deletedItems: number;
};

export type DownloadStatus = {
  resource: MigrationResource;
  totalItems: number;
  downloadedItems: number;
  downloadedIds: number[];
  lastUpdated: string;
  isComplete: boolean;
  filters?: Record<string, string>;
  // Incremental sync fields
  lastSyncStarted?: string;
  lastSyncCompleted?: string;
  syncMode?: "full" | "incremental";
  deletedIds?: number[];
  syncStats?: SyncStats;
};

export function writeStatus(resource: MigrationResource, status: DownloadStatus) {
  writeResourceFile(resource, "_status.json", status);
}

export function readStatus(resource: MigrationResource): DownloadStatus | null {
  const raw = readResourceFile<DownloadStatus>(resource, "_status.json");
  if (!raw) return null;
  // Backward-compat defaults for older status files
  return {
    ...raw,
    syncMode: raw.syncMode ?? "full",
    lastSyncStarted: raw.lastSyncStarted ?? raw.lastUpdated,
    lastSyncCompleted: raw.lastSyncCompleted ?? (raw.isComplete ? raw.lastUpdated : undefined),
    deletedIds: raw.deletedIds ?? [],
    syncStats: raw.syncStats ?? undefined,
  };
}

// ---- Space Info ----

export function writeSpaceInfo(space: StoryblokSpace) {
  const baseDir = getMigrationDir();
  writeFileSync(join(baseDir, "space-info.json"), JSON.stringify(space, null, 2), "utf-8");
}

export function readSpaceInfo(): StoryblokSpace | null {
  const filePath = join(getMigrationDir(), "space-info.json");
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8")) as StoryblokSpace;
}

// ---- Stories by Content Type ----

export function writeStoryByContentType(story: StoryblokStoryFull, contentType: string) {
  const storiesDir = getMigrationDir("stories");
  const typeDir = join(storiesDir, contentType || "_uncategorized");
  ensureDir(typeDir);

  const slug = story.full_slug.replace(/\//g, "--");
  const filename = `${story.id}-${slug}.json`;
  writeFileSync(join(typeDir, filename), JSON.stringify(story, null, 2), "utf-8");
}

export function getDownloadedStoryIds(): number[] {
  const storiesDir = getMigrationDir("stories");
  if (!existsSync(storiesDir)) return [];

  const ids: number[] = [];
  const entries = readdirSync(storiesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;

    const files = readdirSync(join(storiesDir, entry.name));
    for (const file of files) {
      const match = file.match(/^(\d+)-/);
      if (match) ids.push(Number(match[1]));
    }
  }

  return ids;
}

/** Remove a story file by ID from any content-type subdirectory. */
export function removeStoryById(storyId: number): boolean {
  const storiesDir = getMigrationDir("stories");
  if (!existsSync(storiesDir)) return false;

  const entries = readdirSync(storiesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;

    const dirPath = join(storiesDir, entry.name);
    const files = readdirSync(dirPath);
    for (const file of files) {
      if (file.startsWith(`${storyId}-`)) {
        unlinkSync(join(dirPath, file));
        return true;
      }
    }
  }
  return false;
}

// ---- Asset Binary Helpers ----

export function getAssetMetadataDir(): string {
  const dir = join(getMigrationDir("assets"), "metadata");
  ensureDir(dir);
  return dir;
}

export function getAssetFilesDir(): string {
  const dir = join(getMigrationDir("assets"), "files");
  ensureDir(dir);
  return dir;
}

export function writeAssetMetadata(assetId: number, data: unknown) {
  const dir = getAssetMetadataDir();
  writeFileSync(join(dir, `${assetId}.json`), JSON.stringify(data, null, 2), "utf-8");
}

export function writeAssetBinary(assetId: number, filename: string, buffer: Buffer) {
  const dir = getAssetFilesDir();
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  writeFileSync(join(dir, `${assetId}-${sanitized}`), buffer);
}

export function assetBinaryExists(assetId: number): boolean {
  const dir = getAssetFilesDir();
  if (!existsSync(dir)) return false;
  const entries = readdirSync(dir);
  return entries.some((f) => f.startsWith(`${assetId}-`));
}

export function getDownloadedAssetIds(): number[] {
  const dir = getAssetMetadataDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => Number(f.replace(".json", "")))
    .filter((n) => !Number.isNaN(n));
}

// ---- Mapping Config ----

const MAPPING_FILE = "mapping.json";

export function writeMappingConfig(data: unknown) {
  const baseDir = getMigrationDir();
  writeFileSync(join(baseDir, MAPPING_FILE), JSON.stringify(data, null, 2), "utf-8");
}

export function readMappingConfig<T>(): T | null {
  const filePath = join(getMigrationDir(), MAPPING_FILE);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

// ---- Datasource Helpers ----

export function writeDatasourceFiles(slug: string, datasource: unknown, entries: unknown) {
  const dir = join(getMigrationDir("datasources"), slug);
  ensureDir(dir);
  writeFileSync(join(dir, "datasource.json"), JSON.stringify(datasource, null, 2), "utf-8");
  writeFileSync(join(dir, "entries.json"), JSON.stringify(entries, null, 2), "utf-8");
}
