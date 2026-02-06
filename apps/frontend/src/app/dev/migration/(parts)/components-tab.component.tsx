"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { StoryblokComponent } from "@/lib/storyblok/storyblok.types";
import { fetchStoryblokComponents } from "@/server/actions/storyblok-migration.action";

export function ComponentsTab() {
  const [components, setComponents] = useState<StoryblokComponent[]>([]);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleLoad = () => {
    startTransition(async () => {
      const result = await fetchStoryblokComponents();
      if (result.success) {
        setComponents(result.components);
        setTotal(result.total);
        setError(null);
        setHasLoaded(true);
      } else {
        setError(result.error);
      }
    });
  };

  if (!hasLoaded) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-md border border-neutral-200 bg-white py-12">
        <p className="text-sm text-neutral-500">Fetch all Storyblok component schemas.</p>
        <Button onClick={handleLoad} disabled={isPending}>
          {isPending ? "Loading..." : "Load Components"}
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{`${total} components found`}</p>
        <Button onClick={handleLoad} variant="secondary" disabled={isPending}>
          {isPending ? "Reloading..." : "Reload"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-2">
        {components.map((component) => (
          <div key={component.id} className="rounded-md border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === component.id ? null : component.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400">{component.id}</span>
                <span className="font-medium text-neutral-900">{component.name}</span>
                {component.display_name && (
                  <span className="text-sm text-neutral-500">({component.display_name})</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {component.is_root && (
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                    root
                  </span>
                )}
                {component.is_nestable && (
                  <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700">
                    nestable
                  </span>
                )}
                <span className="text-neutral-400">
                  {expandedId === component.id ? "\u25B2" : "\u25BC"}
                </span>
              </div>
            </button>

            {expandedId === component.id && (
              <div className="border-t border-neutral-200 bg-neutral-50 p-4">
                <p className="mb-2 text-xs font-medium text-neutral-500">
                  Schema ({Object.keys(component.schema).length} fields)
                </p>
                <pre className="max-h-96 overflow-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
                  {JSON.stringify(component.schema, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
