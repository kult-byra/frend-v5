"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { DownloadStatus, MigrationResource, SyncStats } from "@/lib/storyblok/migration-fs";
import {
  downloadAllAssets,
  downloadAllComponents,
  downloadAllDatasources,
  downloadStoriesFiltered,
  getAllDownloadStatuses,
} from "@/server/actions/storyblok-migration.action";
import { StatusBadge } from "./status-badge.component";

type Props = {
  initialStatuses: Record<MigrationResource, DownloadStatus | null> | null;
};

export function DownloadPanel({ initialStatuses }: Props) {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [activeDownload, setActiveDownload] = useState<MigrationResource | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastError, setLastError] = useState<string | null>(null);

  // Story download filters
  const [storyStartsWith, setStoryStartsWith] = useState("");
  const [storyContentType, setStoryContentType] = useState("");

  const refreshStatuses = async () => {
    const updated = await getAllDownloadStatuses();
    setStatuses(updated);
  };

  const handleDownloadComponents = () => {
    setActiveDownload("components");
    setLastError(null);
    startTransition(async () => {
      const result = await downloadAllComponents();
      if (!result.success) setLastError(result.error);
      await refreshStatuses();
      setActiveDownload(null);
    });
  };

  const handleDownloadStories = (forceFullSync = false) => {
    setActiveDownload("stories");
    setLastError(null);
    startTransition(async () => {
      const result = await downloadStoriesFiltered({
        startsWith: storyStartsWith || undefined,
        contentType: storyContentType || undefined,
        resume: true,
        forceFullSync,
      });
      if (!result.success) {
        setLastError(result.error);
      }
      await refreshStatuses();
      setActiveDownload(null);
    });
  };

  const handleDownloadAssets = (forceFullSync = false) => {
    setActiveDownload("assets");
    setLastError(null);
    startTransition(async () => {
      const result = await downloadAllAssets({ forceFullSync });
      if (!result.success) setLastError(result.error);
      await refreshStatuses();
      setActiveDownload(null);
    });
  };

  const handleDownloadDatasources = () => {
    setActiveDownload("datasources");
    setLastError(null);
    startTransition(async () => {
      const result = await downloadAllDatasources();
      if (!result.success) setLastError(result.error);
      await refreshStatuses();
      setActiveDownload(null);
    });
  };

  const storiesStatus = statuses?.stories ?? null;
  const assetsStatus = statuses?.assets ?? null;
  const storiesHasPreviousSync = storiesStatus?.isComplete && storiesStatus.lastSyncCompleted;
  const assetsHasPreviousSync = assetsStatus?.isComplete && assetsStatus.lastSyncCompleted;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-neutral-900">Bulk Downloads</h2>

      {lastError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {lastError}
        </div>
      )}

      {/* Components */}
      <ResourceCard
        title="Components"
        status={statuses?.components ?? null}
        isActive={activeDownload === "components"}
        onDownload={handleDownloadComponents}
        disabled={isPending}
      />

      {/* Stories */}
      <div className="rounded-md border border-neutral-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Stories</h3>
          <StatusBadge status={storiesStatus} isActive={activeDownload === "stories"} />
        </div>

        <StatusInfo status={storiesStatus} />

        <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <div>
            <label htmlFor="dl-starts-with" className="mb-1 block text-xs text-neutral-500">
              Folder Path (optional)
            </label>
            <input
              id="dl-starts-with"
              type="text"
              value={storyStartsWith}
              onChange={(e) => setStoryStartsWith(e.target.value)}
              placeholder="e.g. blog/ or en/"
              disabled={isPending}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="dl-content-type" className="mb-1 block text-xs text-neutral-500">
              Content Type (optional)
            </label>
            <input
              id="dl-content-type"
              type="text"
              value={storyContentType}
              onChange={(e) => setStoryContentType(e.target.value)}
              placeholder="e.g. page or article"
              disabled={isPending}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <Button
          onClick={() => handleDownloadStories()}
          disabled={isPending}
          variant={storiesHasPreviousSync ? "secondary" : "primary"}
          className="w-full"
        >
          {activeDownload === "stories"
            ? "Syncing..."
            : storiesHasPreviousSync
              ? "Sync Changes"
              : "Download All"}
        </Button>
        {storiesHasPreviousSync && (
          <button
            type="button"
            onClick={() => handleDownloadStories(true)}
            disabled={isPending}
            className="mt-1.5 w-full text-center text-xs text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
          >
            Force full re-download
          </button>
        )}
      </div>

      {/* Assets */}
      <div className="rounded-md border border-neutral-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Assets (with binaries)</h3>
          <StatusBadge status={assetsStatus} isActive={activeDownload === "assets"} />
        </div>

        <StatusInfo status={assetsStatus} />

        <Button
          onClick={() => handleDownloadAssets()}
          disabled={isPending}
          variant={assetsHasPreviousSync ? "secondary" : "primary"}
          className="w-full"
        >
          {activeDownload === "assets"
            ? "Syncing..."
            : assetsHasPreviousSync
              ? "Sync Changes"
              : "Download All"}
        </Button>
        {assetsHasPreviousSync && (
          <button
            type="button"
            onClick={() => handleDownloadAssets(true)}
            disabled={isPending}
            className="mt-1.5 w-full text-center text-xs text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
          >
            Force full re-download
          </button>
        )}
      </div>

      {/* Datasources */}
      <ResourceCard
        title="Datasources"
        status={statuses?.datasources ?? null}
        isActive={activeDownload === "datasources"}
        onDownload={handleDownloadDatasources}
        disabled={isPending}
      />

      {/* Info */}
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="font-medium text-neutral-900">Download Location</h3>
        <code className="mt-1 inline-block rounded bg-neutral-200 px-2 py-1 text-sm">
          migration-data/
        </code>
        <p className="mt-2 text-sm text-neutral-500">
          Stories are organized by content type. Asset binaries are saved alongside metadata.
          Downloads with a previous sync will automatically run in incremental mode, fetching only
          changed content. Use "Force full re-download" to start fresh.
        </p>
      </div>
    </div>
  );
}

// ---- Helpers ----

function ResourceCard({
  title,
  status,
  isActive,
  onDownload,
  disabled,
}: {
  title: string;
  status: DownloadStatus | null;
  isActive: boolean;
  onDownload: () => void;
  disabled: boolean;
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">{title}</h3>
        <StatusBadge status={status} isActive={isActive} />
      </div>

      <StatusInfo status={status} />

      <Button
        onClick={onDownload}
        disabled={disabled}
        variant={status?.isComplete ? "secondary" : "primary"}
        className="w-full"
      >
        {isActive ? "Downloading..." : status?.isComplete ? "Re-download" : "Download"}
      </Button>
    </div>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function SyncStatsDisplay({ stats, since }: { stats: SyncStats; since?: string }) {
  const parts: string[] = [];
  if (stats.newItems > 0) parts.push(`${stats.newItems} new`);
  if (stats.updatedItems > 0) parts.push(`${stats.updatedItems} updated`);
  if (stats.deletedItems > 0) parts.push(`${stats.deletedItems} deleted`);

  if (parts.length === 0) return null;

  const hasDeleted = stats.deletedItems > 0;

  return (
    <div
      className={`mb-3 rounded px-3 py-2 text-xs ${
        hasDeleted
          ? "border border-amber-200 bg-amber-50 text-amber-700"
          : "border border-blue-200 bg-blue-50 text-blue-700"
      }`}
    >
      <span className="font-medium">
        Last sync{since ? ` (${formatRelativeTime(since)})` : ""}:
      </span>{" "}
      {parts.join(", ")}
    </div>
  );
}

function StatusInfo({ status }: { status: DownloadStatus | null }) {
  if (!status) {
    return <p className="mb-3 text-sm text-neutral-400">No data downloaded yet.</p>;
  }

  return (
    <div className="mb-3 space-y-1 text-sm text-neutral-500">
      <p>
        {status.downloadedItems} / {status.totalItems} items
        {status.syncMode === "incremental" && (
          <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
            Incremental
          </span>
        )}
      </p>
      {status.lastSyncCompleted && (
        <p>Last synced: {formatRelativeTime(status.lastSyncCompleted)}</p>
      )}
      {status.syncStats && (
        <SyncStatsDisplay stats={status.syncStats} since={status.lastSyncCompleted} />
      )}
      {status.filters && Object.keys(status.filters).length > 0 && (
        <p className="text-xs text-neutral-400">
          Filters:{" "}
          {Object.entries(status.filters)
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")}
        </p>
      )}
    </div>
  );
}
