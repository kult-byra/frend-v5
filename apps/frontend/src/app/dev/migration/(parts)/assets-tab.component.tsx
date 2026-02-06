"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { StoryblokAsset } from "@/lib/storyblok/storyblok.types";
import { fetchStoryblokAssets } from "@/server/actions/storyblok-migration.action";

export function AssetsTab() {
  const [assets, setAssets] = useState<StoryblokAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const perPage = 25;

  const loadAssets = (p: number) => {
    startTransition(async () => {
      const result = await fetchStoryblokAssets(p, perPage);
      if (result.success) {
        setAssets(result.assets);
        setTotal(result.total);
        setError(null);
        setHasLoaded(true);
      } else {
        setError(result.error);
      }
    });
  };

  const handleLoadPage = (p: number) => {
    setPage(p);
    loadAssets(p);
  };

  const totalPages = Math.ceil(total / perPage);

  if (!hasLoaded) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-md border border-neutral-200 bg-white py-12">
        <p className="text-sm text-neutral-500">Fetch asset metadata from Storyblok.</p>
        <Button onClick={() => loadAssets(1)} disabled={isPending}>
          {isPending ? "Loading..." : "Load Assets"}
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-neutral-500">
        {isPending ? "Loading..." : `${total} assets found`}
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-2.5 font-medium text-neutral-600">ID</th>
              <th className="px-4 py-2.5 font-medium text-neutral-600">Filename</th>
              <th className="px-4 py-2.5 font-medium text-neutral-600">Type</th>
              <th className="px-4 py-2.5 font-medium text-neutral-600">Title</th>
              <th className="px-4 py-2.5 font-medium text-neutral-600">Alt</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-t border-neutral-200 hover:bg-neutral-50">
                <td className="px-4 py-2.5 font-mono text-xs text-neutral-500">{asset.id}</td>
                <td className="max-w-xs truncate px-4 py-2.5 font-mono text-xs text-neutral-900">
                  {asset.filename}
                </td>
                <td className="px-4 py-2.5 text-xs text-neutral-500">
                  {asset.content_type || "-"}
                </td>
                <td className="px-4 py-2.5 text-xs text-neutral-500">{asset.title || "-"}</td>
                <td className="px-4 py-2.5 text-xs text-neutral-500">{asset.alt || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
