"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { StoryblokSpace } from "@/lib/storyblok/storyblok.types";
import { verifyStoryblokSpace } from "@/server/actions/storyblok-migration.action";

type Props = {
  initialSpace: StoryblokSpace | null;
};

export function SpaceVerification({ initialSpace }: Props) {
  const [space, setSpace] = useState(initialSpace);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    startTransition(async () => {
      const result = await verifyStoryblokSpace();
      if (result.success) {
        setSpace(result.space);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  };

  if (!space) {
    return (
      <div className="rounded-md border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900">Space Verification</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Verify your API token and confirm the correct Storyblok space.
            </p>
          </div>
          <Button onClick={handleVerify} disabled={isPending}>
            {isPending ? "Verifying..." : "Verify Connection"}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-green-200 bg-green-50 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-green-900">{space.name}</h3>
          <p className="mt-0.5 text-sm text-green-700">Space ID: {space.id}</p>
        </div>
        <Button onClick={handleVerify} disabled={isPending} variant="secondary">
          {isPending ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span className="text-green-700">
          Plan: <span className="font-medium text-green-900">{space.plan}</span>
        </span>
        <span className="text-green-700">
          Domain: <span className="font-medium text-green-900">{space.domain}</span>
        </span>
        {space.stories_count !== undefined && (
          <span className="text-green-700">
            Stories: <span className="font-medium text-green-900">{space.stories_count}</span>
          </span>
        )}
        {space.assets_count !== undefined && (
          <span className="text-green-700">
            Assets: <span className="font-medium text-green-900">{space.assets_count}</span>
          </span>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
