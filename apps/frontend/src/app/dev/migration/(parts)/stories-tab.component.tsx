"use client";

import { Fragment, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { StoryblokStoryListItem } from "@/lib/storyblok/storyblok.types";
import {
  downloadSingleStory,
  fetchStoryblokStories,
  fetchStoryblokStory,
  getAvailableContentTypes,
  type StoryFilterParams,
} from "@/server/actions/storyblok-migration.action";

export function StoriesTab() {
  const [stories, setStories] = useState<StoryblokStoryListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const perPage = 25;

  // Filters
  const [search, setSearch] = useState("");
  const [startsWith, setStartsWith] = useState("");
  const [contentType, setContentType] = useState("");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [typesLoaded, setTypesLoaded] = useState(false);

  // Expanded story
  const [expandedStoryId, setExpandedStoryId] = useState<number | null>(null);
  const [expandedContent, setExpandedContent] = useState<unknown>(null);
  const [loadingStoryId, setLoadingStoryId] = useState<number | null>(null);

  // Download state
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [isDownloadingPage, setIsDownloadingPage] = useState(false);

  const buildParams = (p: number): StoryFilterParams => ({
    page: p,
    perPage,
    search: search || undefined,
    startsWith: startsWith || undefined,
    contentType: contentType || undefined,
  });

  const loadStories = (p: number) => {
    startTransition(async () => {
      const result = await fetchStoryblokStories(buildParams(p));
      if (result.success) {
        setStories(result.stories);
        setTotal(result.total);
        setError(null);
        setHasLoaded(true);
      } else {
        setError(result.error);
      }
    });
  };

  const handleLoadContentTypes = async () => {
    if (typesLoaded) return;
    const result = await getAvailableContentTypes();
    if (result.success) {
      setAvailableTypes(result.contentTypes);
      setTypesLoaded(true);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    setExpandedStoryId(null);
    setExpandedContent(null);
    loadStories(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStartsWith("");
    setContentType("");
    setPage(1);
    setExpandedStoryId(null);
    setExpandedContent(null);
    loadStories(1);
  };

  const handleLoadPage = (p: number) => {
    setPage(p);
    setExpandedStoryId(null);
    setExpandedContent(null);
    loadStories(p);
  };

  const handleExpandStory = async (storyId: number) => {
    if (expandedStoryId === storyId) {
      setExpandedStoryId(null);
      setExpandedContent(null);
      return;
    }

    setExpandedStoryId(storyId);
    setExpandedContent(null);
    setLoadingStoryId(storyId);

    const result = await fetchStoryblokStory(storyId);
    if (result.success) {
      setExpandedContent(result.story.content);
    }
    setLoadingStoryId(null);
  };

  const handleDownloadSingle = async (storyId: number) => {
    setDownloadingIds((prev) => new Set(prev).add(storyId));
    const result = await downloadSingleStory(storyId);
    setDownloadingIds((prev) => {
      const next = new Set(prev);
      next.delete(storyId);
      return next;
    });
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleDownloadCurrentPage = async () => {
    setIsDownloadingPage(true);
    for (const story of stories) {
      if (story.is_folder) continue;
      setDownloadingIds((prev) => new Set(prev).add(story.id));
      await downloadSingleStory(story.id);
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(story.id);
        return next;
      });
    }
    setIsDownloadingPage(false);
  };

  const totalPages = Math.ceil(total / perPage);

  if (!hasLoaded) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-md border border-neutral-200 bg-white py-12">
        <p className="text-sm text-neutral-500">
          Browse and download stories with search and filtering.
        </p>
        <Button onClick={() => loadStories(1)} disabled={isPending}>
          {isPending ? "Loading..." : "Load Stories"}
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Panel */}
      <div className="rounded-md border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-700">Filters</p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs text-neutral-400 hover:text-neutral-600"
          >
            Clear all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label htmlFor="filter-search" className="mb-1 block text-xs text-neutral-500">
              Search
            </label>
            <input
              id="filter-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyFilters();
              }}
              placeholder="Search by name..."
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="filter-starts-with" className="mb-1 block text-xs text-neutral-500">
              Folder Path
            </label>
            <input
              id="filter-starts-with"
              type="text"
              value={startsWith}
              onChange={(e) => setStartsWith(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyFilters();
              }}
              placeholder="e.g. blog/ or en/"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="filter-content-type" className="mb-1 block text-xs text-neutral-500">
              Content Type
            </label>
            <select
              id="filter-content-type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              onFocus={handleLoadContentTypes}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            >
              <option value="">All types</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={handleApplyFilters} disabled={isPending}>
            {isPending ? "Loading..." : "Apply Filters"}
          </Button>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {isPending ? "Loading..." : `${total} stories found`}
        </p>
        <div className="flex gap-2">
          <Button
            onClick={handleDownloadCurrentPage}
            disabled={isDownloadingPage || stories.length === 0 || isPending}
            variant="secondary"
          >
            {isDownloadingPage ? "Saving..." : "Save Current Page"}
          </Button>
          <Button onClick={() => loadStories(page)} variant="secondary" disabled={isPending}>
            {isPending ? "Reloading..." : "Reload"}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Stories Table */}
      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-2.5 font-medium text-neutral-600">ID</th>
              <th className="px-4 py-2.5 font-medium text-neutral-600">Name</th>
              <th className="px-4 py-2.5 font-medium text-neutral-600">Full Slug</th>
              <th className="px-4 py-2.5 font-medium text-neutral-600">Type</th>
              <th className="px-4 py-2.5 font-medium text-neutral-600">Published</th>
              <th className="w-20 px-4 py-2.5 font-medium text-neutral-600" />
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => {
              const isExpanded = expandedStoryId === story.id;
              const isDownloading = downloadingIds.has(story.id);
              const isLoadingContent = loadingStoryId === story.id;

              return (
                <Fragment key={story.id}>
                  <tr
                    className="cursor-pointer border-t border-neutral-200 hover:bg-neutral-50"
                    onClick={() => handleExpandStory(story.id)}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-neutral-500">{story.id}</td>
                    <td className="px-4 py-2.5 font-medium text-neutral-900">
                      {story.name}
                      {story.is_folder && (
                        <span className="ml-2 rounded bg-neutral-200 px-1.5 py-0.5 text-xs text-neutral-600">
                          folder
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-neutral-500">
                      {story.full_slug}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-neutral-500">
                      {story.content_type || "-"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-neutral-500">
                      {story.published_at
                        ? new Date(story.published_at).toLocaleDateString()
                        : "Draft"}
                    </td>
                    <td className="px-4 py-2.5">
                      {!story.is_folder && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSingle(story.id);
                          }}
                          disabled={isDownloading}
                          className="rounded bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-50"
                        >
                          {isDownloading ? "..." : "Save"}
                        </button>
                      )}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="border-t border-neutral-200 p-0">
                        <div className="bg-neutral-50 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-medium text-neutral-500">
                              Content for: {story.name}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedStoryId(null);
                                setExpandedContent(null);
                              }}
                              className="text-xs text-neutral-400 hover:text-neutral-600"
                            >
                              Close
                            </button>
                          </div>
                          {isLoadingContent && (
                            <p className="text-sm text-neutral-500">Loading content...</p>
                          )}
                          {expandedContent != null && (
                            <pre className="max-h-96 overflow-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
                              {JSON.stringify(expandedContent, null, 2)}
                            </pre>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            disabled={page <= 1 || isPending}
            onClick={() => handleLoadPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages || isPending}
            onClick={() => handleLoadPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
