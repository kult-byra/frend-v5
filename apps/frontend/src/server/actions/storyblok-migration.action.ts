"use server";

import {
  assetBinaryExists,
  type DownloadStatus,
  getDownloadedStoryIds,
  type MigrationResource,
  readMappingConfig,
  readSpaceInfo,
  readStatus,
  removeStoryById,
  type SyncStats,
  writeAssetBinary,
  writeAssetMetadata,
  writeDatasourceFiles,
  writeMappingConfig,
  writeResourceFile,
  writeSpaceInfo,
  writeStatus,
  writeStoryByContentType,
} from "@/lib/storyblok/migration-fs";
import type {
  StoryblokAsset,
  StoryblokComponent,
  StoryblokDatasource,
  StoryblokDatasourceEntry,
  StoryblokSpace,
  StoryblokStoryFull,
  StoryblokStoryListItem,
} from "@/lib/storyblok/storyblok.types";
import {
  fetchStoryblokSpace,
  getStoryblokConfig,
  storyblokFetch,
} from "@/lib/storyblok/storyblok-client";

const RATE_LIMIT_DELAY_MS = 200;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- Check Configuration ----

export type ConfigCheckResult = { configured: true } | { configured: false; message: string };

export async function checkStoryblokConfig(): Promise<ConfigCheckResult> {
  const config = getStoryblokConfig();
  if (!config.configured) {
    return {
      configured: false,
      message: "Missing STORYBLOK_MANAGEMENT_TOKEN or STORYBLOK_SPACE_ID in .env.local",
    };
  }
  return { configured: true };
}

// ---- Space Verification ----

export type VerifySpaceResult =
  | { success: true; space: StoryblokSpace }
  | { success: false; error: string };

export async function verifyStoryblokSpace(): Promise<VerifySpaceResult> {
  try {
    const space = await fetchStoryblokSpace();
    writeSpaceInfo(space);
    return { success: true, space };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify space",
    };
  }
}

export async function getStoredSpaceInfo(): Promise<StoryblokSpace | null> {
  return readSpaceInfo();
}

// ---- Fetch Components ----

export type FetchComponentsResult =
  | { success: true; components: StoryblokComponent[]; total: number }
  | { success: false; error: string };

export async function fetchStoryblokComponents(): Promise<FetchComponentsResult> {
  try {
    const allComponents: StoryblokComponent[] = [];
    let page = 1;

    const firstPage = await storyblokFetch<{ components: StoryblokComponent[] }>({
      endpoint: "components",
      params: { per_page: 100, page },
    });

    allComponents.push(...(firstPage.data.components ?? []));
    const totalPages = Math.ceil(firstPage.total / 100);

    for (page = 2; page <= totalPages; page++) {
      const result = await storyblokFetch<{ components: StoryblokComponent[] }>({
        endpoint: "components",
        params: { per_page: 100, page },
      });
      allComponents.push(...(result.data.components ?? []));
      await delay(RATE_LIMIT_DELAY_MS);
    }

    return {
      success: true,
      components: allComponents,
      total: firstPage.total,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch components",
    };
  }
}

// ---- Fetch Stories (with filters) ----

export type StoryFilterParams = {
  page?: number;
  perPage?: number;
  search?: string;
  startsWith?: string;
  contentType?: string;
  withTag?: string;
};

export type FetchStoriesResult =
  | {
      success: true;
      stories: StoryblokStoryListItem[];
      total: number;
      page: number;
      perPage: number;
    }
  | { success: false; error: string };

export async function fetchStoryblokStories(
  params: StoryFilterParams = {},
): Promise<FetchStoriesResult> {
  try {
    const { page = 1, perPage = 25, search, startsWith, contentType, withTag } = params;

    const apiParams: Record<string, string | number> = {
      page,
      per_page: perPage,
    };
    if (search) apiParams.text_search = search;
    if (startsWith) apiParams.starts_with = startsWith;
    if (contentType) apiParams.content_type = contentType;
    if (withTag) apiParams.with_tag = withTag;

    const result = await storyblokFetch<{ stories: StoryblokStoryListItem[] }>({
      endpoint: "stories",
      params: apiParams,
    });
    return {
      success: true,
      stories: result.data.stories ?? [],
      total: result.total,
      page,
      perPage: result.perPage,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stories",
    };
  }
}

// ---- Fetch Single Story ----

export type FetchStoryResult =
  | { success: true; story: StoryblokStoryFull }
  | { success: false; error: string };

export async function fetchStoryblokStory(storyId: number): Promise<FetchStoryResult> {
  try {
    const result = await storyblokFetch<{ story: StoryblokStoryFull }>({
      endpoint: `stories/${storyId}`,
    });
    return { success: true, story: result.data.story };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch story",
    };
  }
}

// ---- Download Single Story to Disk ----

export type DownloadSingleStoryResult =
  | { success: true; contentType: string }
  | { success: false; error: string };

export async function downloadSingleStory(storyId: number): Promise<DownloadSingleStoryResult> {
  try {
    const result = await storyblokFetch<{ story: StoryblokStoryFull }>({
      endpoint: `stories/${storyId}`,
    });

    const story = result.data.story;
    const contentType = story.content?.component as string | undefined;
    const folder = contentType || "_uncategorized";
    writeStoryByContentType(story, folder);

    return { success: true, contentType: folder };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to download story",
    };
  }
}

// ---- Fetch Assets (paginated) ----

export type FetchAssetsResult =
  | {
      success: true;
      assets: StoryblokAsset[];
      total: number;
      page: number;
      perPage: number;
    }
  | { success: false; error: string };

export async function fetchStoryblokAssets(page = 1, perPage = 25): Promise<FetchAssetsResult> {
  try {
    const result = await storyblokFetch<{ assets: StoryblokAsset[] }>({
      endpoint: "assets",
      params: { page, per_page: perPage },
    });
    return {
      success: true,
      assets: result.data.assets ?? [],
      total: result.total,
      page,
      perPage: result.perPage,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch assets",
    };
  }
}

// ---- Download All Components ----

export type DownloadResult =
  | { success: true; totalItems: number; syncStats?: SyncStats }
  | { success: false; error: string };

export async function downloadAllComponents(): Promise<DownloadResult> {
  try {
    const syncStarted = new Date().toISOString();
    const previousStatus = readStatus("components");
    const previousIds = new Set(previousStatus?.downloadedIds ?? []);

    const components: StoryblokComponent[] = [];
    let page = 1;

    const firstPage = await storyblokFetch<{ components: StoryblokComponent[] }>({
      endpoint: "components",
      params: { per_page: 100, page },
    });

    components.push(...(firstPage.data.components ?? []));
    const totalPages = Math.ceil(firstPage.total / 100);

    for (page = 2; page <= totalPages; page++) {
      const pageResult = await storyblokFetch<{ components: StoryblokComponent[] }>({
        endpoint: "components",
        params: { per_page: 100, page },
      });
      components.push(...(pageResult.data.components ?? []));
      await delay(RATE_LIMIT_DELAY_MS);
    }
    const currentIds = new Set(components.map((c) => c.id));
    const index: Array<{
      id: number;
      name: string;
      display_name: string | null;
      is_root: boolean;
      is_nestable: boolean;
    }> = [];

    for (const component of components) {
      const filename = `${component.id}-${component.name}.json`;
      writeResourceFile("components", filename, component);
      index.push({
        id: component.id,
        name: component.name,
        display_name: component.display_name,
        is_root: component.is_root ?? false,
        is_nestable: component.is_nestable ?? false,
      });
    }

    const deletedIds = [...previousIds].filter((id) => !currentIds.has(id));
    const newIds = [...currentIds].filter((id) => !previousIds.has(id));

    writeResourceFile("components", "_index.json", index);
    writeStatus("components", {
      resource: "components",
      totalItems: components.length,
      downloadedItems: components.length,
      downloadedIds: components.map((c) => c.id),
      lastUpdated: new Date().toISOString(),
      isComplete: true,
      lastSyncStarted: syncStarted,
      lastSyncCompleted: new Date().toISOString(),
      syncMode: previousStatus ? "incremental" : "full",
      deletedIds,
      syncStats: {
        newItems: newIds.length,
        updatedItems: previousStatus ? components.length - newIds.length : 0,
        deletedItems: deletedIds.length,
      },
    });

    return {
      success: true,
      totalItems: components.length,
      syncStats: {
        newItems: newIds.length,
        updatedItems: previousStatus ? components.length - newIds.length : 0,
        deletedItems: deletedIds.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to download components",
    };
  }
}

// ---- Download Stories (with filters + resume + incremental) ----

export type DownloadStoriesParams = {
  startsWith?: string;
  contentType?: string;
  withTag?: string;
  resume?: boolean;
  forceFullSync?: boolean;
};

export type DownloadStoriesResult =
  | {
      success: true;
      totalItems: number;
      downloadedItems: number;
      skippedItems: number;
      syncStats?: SyncStats;
    }
  | { success: false; error: string };

export async function downloadStoriesFiltered(
  params: DownloadStoriesParams = {},
): Promise<DownloadStoriesResult> {
  try {
    const syncStarted = new Date().toISOString();
    const previousStatus = readStatus("stories");
    const canIncremental =
      !params.forceFullSync && previousStatus?.isComplete && previousStatus.lastSyncStarted;

    // Build API params
    const apiParams: Record<string, string | number> = {
      page: 1,
      per_page: 100,
    };
    if (params.startsWith) apiParams.starts_with = params.startsWith;
    if (params.contentType) apiParams.content_type = params.contentType;
    if (params.withTag) apiParams.with_tag = params.withTag;

    // For incremental: only fetch stories updated since last sync
    if (canIncremental && previousStatus.lastSyncStarted) {
      apiParams.updated_at_gte = previousStatus.lastSyncStarted;
    }

    const firstPage = await storyblokFetch<{ stories: StoryblokStoryListItem[] }>({
      endpoint: "stories",
      params: apiParams,
    });

    const totalFromQuery = firstPage.total;
    const totalPages = Math.ceil(totalFromQuery / 100);

    const alreadyDownloaded =
      params.resume || canIncremental ? new Set(getDownloadedStoryIds()) : new Set<number>();
    const allDownloadedIds = canIncremental
      ? [...(previousStatus?.downloadedIds ?? [])]
      : [...alreadyDownloaded];
    const allDownloadedSet = new Set(allDownloadedIds);
    let newlyDownloaded = 0;
    let updatedCount = 0;
    let skipped = 0;
    const index: StoryblokStoryListItem[] = [];

    for (let page = 1; page <= totalPages; page++) {
      const pageResult =
        page === 1
          ? firstPage
          : await storyblokFetch<{ stories: StoryblokStoryListItem[] }>({
              endpoint: "stories",
              params: { ...apiParams, page },
            });

      for (const story of pageResult.data.stories) {
        index.push(story);

        if (!canIncremental && alreadyDownloaded.has(story.id)) {
          skipped++;
          continue;
        }

        const isUpdate = alreadyDownloaded.has(story.id);

        // For incremental: remove old file first (content type may have changed)
        if (canIncremental && isUpdate) {
          removeStoryById(story.id);
        }

        const fullResult = await storyblokFetch<{ story: StoryblokStoryFull }>({
          endpoint: `stories/${story.id}`,
        });

        const fullStory = fullResult.data.story;
        const contentType =
          (fullStory.content?.component as string | undefined) || "_uncategorized";
        writeStoryByContentType(fullStory, contentType);

        if (!allDownloadedSet.has(story.id)) {
          allDownloadedIds.push(story.id);
          allDownloadedSet.add(story.id);
        }

        if (isUpdate) {
          updatedCount++;
        } else {
          newlyDownloaded++;
        }

        await delay(RATE_LIMIT_DELAY_MS);
      }

      // Update status after each page
      writeStatus("stories", {
        resource: "stories",
        totalItems: canIncremental
          ? (previousStatus?.totalItems ?? totalFromQuery)
          : totalFromQuery,
        downloadedItems: allDownloadedIds.length,
        downloadedIds: allDownloadedIds,
        lastUpdated: new Date().toISOString(),
        isComplete: false,
        lastSyncStarted: syncStarted,
        syncMode: canIncremental ? "incremental" : "full",
        filters: {
          ...(params.startsWith ? { startsWith: params.startsWith } : {}),
          ...(params.contentType ? { contentType: params.contentType } : {}),
          ...(params.withTag ? { withTag: params.withTag } : {}),
        },
      });
    }

    // Deletion detection: fetch all current story IDs from API
    let deletedIds: number[] = [];
    if (canIncremental && previousStatus?.downloadedIds) {
      const allCurrentIds = await fetchAllStoryIds(params);
      const currentIdSet = new Set(allCurrentIds);
      deletedIds = previousStatus.downloadedIds.filter((id) => !currentIdSet.has(id));
    }

    // Get the actual total for final status
    const actualTotal = canIncremental ? await fetchStoryCount(params) : totalFromQuery;

    if (!canIncremental) {
      writeResourceFile("stories", "_index.json", index);
    }

    const syncStats: SyncStats = {
      newItems: newlyDownloaded,
      updatedItems: updatedCount,
      deletedItems: deletedIds.length,
    };

    writeStatus("stories", {
      resource: "stories",
      totalItems: actualTotal,
      downloadedItems: allDownloadedIds.length,
      downloadedIds: allDownloadedIds,
      lastUpdated: new Date().toISOString(),
      isComplete: true,
      lastSyncStarted: syncStarted,
      lastSyncCompleted: new Date().toISOString(),
      syncMode: canIncremental ? "incremental" : "full",
      deletedIds,
      syncStats,
      filters: {
        ...(params.startsWith ? { startsWith: params.startsWith } : {}),
        ...(params.contentType ? { contentType: params.contentType } : {}),
        ...(params.withTag ? { withTag: params.withTag } : {}),
      },
    });

    return {
      success: true,
      totalItems: actualTotal,
      downloadedItems: newlyDownloaded + updatedCount,
      skippedItems: skipped,
      syncStats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to download stories",
    };
  }
}

/** Fetch all story IDs without downloading full content (for deletion detection). */
async function fetchAllStoryIds(
  params: Pick<DownloadStoriesParams, "startsWith" | "contentType" | "withTag">,
): Promise<number[]> {
  const ids: number[] = [];
  const apiParams: Record<string, string | number> = { page: 1, per_page: 100 };
  if (params.startsWith) apiParams.starts_with = params.startsWith;
  if (params.contentType) apiParams.content_type = params.contentType;
  if (params.withTag) apiParams.with_tag = params.withTag;

  const firstPage = await storyblokFetch<{ stories: StoryblokStoryListItem[] }>({
    endpoint: "stories",
    params: apiParams,
  });

  for (const s of firstPage.data.stories) ids.push(s.id);
  const totalPages = Math.ceil(firstPage.total / 100);

  for (let page = 2; page <= totalPages; page++) {
    const result = await storyblokFetch<{ stories: StoryblokStoryListItem[] }>({
      endpoint: "stories",
      params: { ...apiParams, page },
    });
    for (const s of result.data.stories) ids.push(s.id);
    await delay(RATE_LIMIT_DELAY_MS);
  }

  return ids;
}

/** Fetch total story count (for incremental sync final status). */
async function fetchStoryCount(
  params: Pick<DownloadStoriesParams, "startsWith" | "contentType" | "withTag">,
): Promise<number> {
  const apiParams: Record<string, string | number> = { page: 1, per_page: 1 };
  if (params.startsWith) apiParams.starts_with = params.startsWith;
  if (params.contentType) apiParams.content_type = params.contentType;
  if (params.withTag) apiParams.with_tag = params.withTag;

  const result = await storyblokFetch<{ stories: StoryblokStoryListItem[] }>({
    endpoint: "stories",
    params: apiParams,
  });
  return result.total;
}

// ---- Download All Assets (with binaries + resume + incremental) ----

export type DownloadAssetsResult =
  | { success: true; totalItems: number; syncStats?: SyncStats }
  | { success: false; error: string };

export async function downloadAllAssets(
  options: { forceFullSync?: boolean } = {},
): Promise<DownloadAssetsResult> {
  try {
    const syncStarted = new Date().toISOString();
    const previousStatus = readStatus("assets");
    const canIncremental =
      !options.forceFullSync && previousStatus?.isComplete && previousStatus.lastSyncStarted;

    const previousIdSet = new Set(previousStatus?.downloadedIds ?? []);

    // Phase 1: Metadata pass — paginate all assets
    const firstPage = await storyblokFetch<{ assets: StoryblokAsset[] }>({
      endpoint: "assets",
      params: { page: 1, per_page: 100 },
    });

    const totalAssets = firstPage.total;
    const totalPages = Math.ceil(totalAssets / 100);
    const allAssets: StoryblokAsset[] = [];

    for (let page = 1; page <= totalPages; page++) {
      const pageResult =
        page === 1
          ? firstPage
          : await storyblokFetch<{ assets: StoryblokAsset[] }>({
              endpoint: "assets",
              params: { page, per_page: 100 },
            });

      for (const asset of pageResult.data.assets) {
        writeAssetMetadata(asset.id, asset);
        allAssets.push(asset);
      }

      if (page < totalPages) {
        await delay(RATE_LIMIT_DELAY_MS);
      }
    }

    writeResourceFile("assets", "_index.json", allAssets);

    // Deletion detection
    const currentIdSet = new Set(allAssets.map((a) => a.id));
    const deletedIds = [...previousIdSet].filter((id) => !currentIdSet.has(id));

    // Phase 2: Binary download pass
    let newBinaries = 0;
    let updatedBinaries = 0;
    const allDownloadedIds: number[] = [];

    for (let i = 0; i < allAssets.length; i++) {
      const asset = allAssets[i]!;
      allDownloadedIds.push(asset.id);

      const alreadyHasBinary = assetBinaryExists(asset.id);
      const isUpdated =
        canIncremental &&
        previousIdSet.has(asset.id) &&
        previousStatus.lastSyncStarted &&
        asset.updated_at > previousStatus.lastSyncStarted;

      if (alreadyHasBinary && !isUpdated) {
        // Skip — binary already exists and hasn't been updated
      } else {
        const downloaded = await downloadAssetBinary(asset);
        if (downloaded) {
          if (previousIdSet.has(asset.id)) {
            updatedBinaries++;
          } else {
            newBinaries++;
          }
        }
        await delay(RATE_LIMIT_DELAY_MS);
      }

      // Update status every 25 assets
      if ((i + 1) % 25 === 0 || i === allAssets.length - 1) {
        writeStatus("assets", {
          resource: "assets",
          totalItems: totalAssets,
          downloadedItems: allDownloadedIds.length,
          downloadedIds: allDownloadedIds,
          lastUpdated: new Date().toISOString(),
          isComplete: false,
          lastSyncStarted: syncStarted,
          syncMode: canIncremental ? "incremental" : "full",
        });
      }
    }

    const syncStats: SyncStats = {
      newItems: newBinaries,
      updatedItems: updatedBinaries,
      deletedItems: deletedIds.length,
    };

    writeStatus("assets", {
      resource: "assets",
      totalItems: totalAssets,
      downloadedItems: allDownloadedIds.length,
      downloadedIds: allDownloadedIds,
      lastUpdated: new Date().toISOString(),
      isComplete: true,
      lastSyncStarted: syncStarted,
      lastSyncCompleted: new Date().toISOString(),
      syncMode: canIncremental ? "incremental" : "full",
      deletedIds,
      syncStats,
    });

    return { success: true, totalItems: totalAssets, syncStats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to download assets",
    };
  }
}

/** Download a single asset binary from the Storyblok CDN. */
async function downloadAssetBinary(asset: StoryblokAsset): Promise<boolean> {
  if (!asset.filename) return false;

  try {
    const response = await fetch(asset.filename, { cache: "no-store" });
    if (!response.ok) return false;

    const buffer = Buffer.from(await response.arrayBuffer());
    const urlFilename = asset.filename.split("/").pop() ?? `asset-${asset.id}`;
    writeAssetBinary(asset.id, urlFilename, buffer);
    return true;
  } catch {
    return false;
  }
}

// ---- Download All Datasources ----

export async function downloadAllDatasources(): Promise<DownloadResult> {
  try {
    const syncStarted = new Date().toISOString();

    const result = await storyblokFetch<{ datasources: StoryblokDatasource[] }>({
      endpoint: "datasources",
      params: { per_page: 100 },
    });

    const datasources = result.data.datasources ?? [];
    const index: StoryblokDatasource[] = [];

    for (const ds of datasources) {
      // Fetch all entries for this datasource with pagination
      const allEntries: StoryblokDatasourceEntry[] = [];
      let entryPage = 1;

      const firstEntryPage = await storyblokFetch<{
        datasource_entries: StoryblokDatasourceEntry[];
      }>({
        endpoint: "datasource_entries",
        params: { datasource_id: ds.id, per_page: 100, page: entryPage },
      });

      allEntries.push(...(firstEntryPage.data.datasource_entries ?? []));
      const totalEntryPages = Math.ceil(firstEntryPage.total / 100);

      for (entryPage = 2; entryPage <= totalEntryPages; entryPage++) {
        const entryPageResult = await storyblokFetch<{
          datasource_entries: StoryblokDatasourceEntry[];
        }>({
          endpoint: "datasource_entries",
          params: { datasource_id: ds.id, per_page: 100, page: entryPage },
        });
        allEntries.push(...(entryPageResult.data.datasource_entries ?? []));
        await delay(RATE_LIMIT_DELAY_MS);
      }

      writeDatasourceFiles(ds.slug, ds, allEntries);
      index.push(ds);

      await delay(RATE_LIMIT_DELAY_MS);
    }

    writeResourceFile("datasources", "_index.json", index);
    writeStatus("datasources", {
      resource: "datasources",
      totalItems: datasources.length,
      downloadedItems: datasources.length,
      downloadedIds: datasources.map((ds) => ds.id),
      lastUpdated: new Date().toISOString(),
      isComplete: true,
      lastSyncStarted: syncStarted,
      lastSyncCompleted: new Date().toISOString(),
      syncMode: "full",
    });

    return { success: true, totalItems: datasources.length };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to download datasources",
    };
  }
}

// ---- Content Type Discovery ----

export type ContentTypesResult =
  | { success: true; contentTypes: string[] }
  | { success: false; error: string };

export async function getAvailableContentTypes(): Promise<ContentTypesResult> {
  try {
    const types = new Set<string>();
    let page = 1;
    let totalPages = 1;

    do {
      const result = await storyblokFetch<{ stories: StoryblokStoryListItem[] }>({
        endpoint: "stories",
        params: { per_page: 100, page, story_only: 1 },
      });

      for (const story of result.data.stories) {
        if (story.content_type) types.add(story.content_type);
      }

      totalPages = Math.ceil(result.total / 100);
      page++;

      if (page <= totalPages) await delay(RATE_LIMIT_DELAY_MS);
    } while (page <= totalPages);

    return { success: true, contentTypes: Array.from(types).sort() };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch content types",
    };
  }
}

// ---- Get Download Statuses ----

export async function getAllDownloadStatuses(): Promise<
  Record<MigrationResource, DownloadStatus | null>
> {
  return {
    components: readStatus("components"),
    stories: readStatus("stories"),
    assets: readStatus("assets"),
    datasources: readStatus("datasources"),
  };
}

// ---- Mapping Config ----

export type MappingStatus = "mapped" | "partial" | "skip" | "todo";

export type DocumentMapping = {
  storyblok: string;
  storyblokDisplay: string;
  sanity: string | null;
  status: MappingStatus;
  storyCount: number;
  exampleSlug: string | null;
  notes: string;
};

export type BlockMapping = {
  storyblok: string;
  storyblokDisplay: string;
  sanity: string | null;
  status: MappingStatus;
  notes: string;
};

export type MappingConfig = {
  documentMappings: DocumentMapping[];
  blockMappings: BlockMapping[];
  lastUpdated: string;
};

export async function loadMappingConfig(): Promise<MappingConfig | null> {
  return readMappingConfig<MappingConfig>();
}

export async function saveMappingConfig(config: MappingConfig): Promise<{ success: boolean }> {
  try {
    writeMappingConfig({ ...config, lastUpdated: new Date().toISOString() });
    return { success: true };
  } catch {
    return { success: false };
  }
}
