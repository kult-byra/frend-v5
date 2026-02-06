import type { DownloadStatus } from "@/lib/storyblok/migration-fs";

type StatusBadgeProps = {
  status: DownloadStatus | null;
  isActive: boolean;
};

export function StatusBadge({ status, isActive }: StatusBadgeProps) {
  if (isActive) {
    return (
      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
        Downloading
      </span>
    );
  }
  if (!status) {
    return (
      <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
        Not downloaded
      </span>
    );
  }
  if (status.isComplete) {
    return (
      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
        Complete
      </span>
    );
  }
  return (
    <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
      Partial
    </span>
  );
}
