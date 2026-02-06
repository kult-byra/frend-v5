import {
  checkStoryblokConfig,
  getAllDownloadStatuses,
  getStoredSpaceInfo,
} from "@/server/actions/storyblok-migration.action";
import { MigrationDashboard } from "./(parts)/migration-dashboard.component";

export default async function MigrationPage() {
  const configCheck = await checkStoryblokConfig();
  const statuses = configCheck.configured ? await getAllDownloadStatuses() : null;
  const spaceInfo = configCheck.configured ? await getStoredSpaceInfo() : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900">Content Migration</h1>
          <p className="mt-1 text-neutral-500">Storyblok → Sanity migration dashboard.</p>
        </div>

        {!configCheck.configured ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-800">Configuration Missing</p>
            <p className="mt-1 text-sm text-red-700">{configCheck.message}</p>
            <pre className="mt-3 rounded bg-red-100 p-3 text-sm text-red-900">
              {`STORYBLOK_MANAGEMENT_TOKEN="your-token"\nSTORYBLOK_SPACE_ID="your-space-id"`}
            </pre>
          </div>
        ) : (
          <MigrationDashboard initialStatuses={statuses} initialSpace={spaceInfo} />
        )}
      </div>
    </div>
  );
}
