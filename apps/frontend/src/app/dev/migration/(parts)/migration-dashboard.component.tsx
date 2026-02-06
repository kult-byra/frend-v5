"use client";

import { useState } from "react";

import type { DownloadStatus, MigrationResource } from "@/lib/storyblok/migration-fs";
import type { StoryblokSpace } from "@/lib/storyblok/storyblok.types";
import { AssetsTab } from "./assets-tab.component";
import { ComponentsTab } from "./components-tab.component";
import { DownloadPanel } from "./download-panel.component";
import { MappingTab } from "./mapping-tab.component";
import { SanityTab } from "./sanity-tab.component";
import { SpaceVerification } from "./space-verification.component";
import { StoriesTab } from "./stories-tab.component";

type SectionId = "storyblok" | "mapping" | "sanity";
type StoryblokTabId = "components" | "stories" | "assets" | "download";

const SECTIONS: { id: SectionId; label: string; description: string; disabled?: boolean }[] = [
  {
    id: "storyblok",
    label: "Storyblok",
    description: "Browse and download content from the Storyblok CMS.",
  },
  {
    id: "mapping",
    label: "Mapping",
    description:
      "Map Storyblok content types and components to their Sanity equivalents. Track migration progress for document types and page builder blocks.",
  },
  {
    id: "sanity",
    label: "Sanity",
    description: "Upload migrated content to Sanity and run patch operations.",
  },
];

const STORYBLOK_TABS: { id: StoryblokTabId; label: string; description: string }[] = [
  {
    id: "components",
    label: "Components",
    description:
      "Browse Storyblok component definitions (bloks). These are the building blocks used to compose stories — similar to Sanity schema types.",
  },
  {
    id: "stories",
    label: "Stories",
    description:
      "Browse and inspect Storyblok stories (pages, articles, etc.). Each story is a content entry built from components. You can filter by content type and path, and view the full JSON payload.",
  },
  {
    id: "assets",
    label: "Assets",
    description:
      "Browse images, videos, and other files uploaded to the Storyblok asset library. These will need to be re-uploaded to Sanity during migration.",
  },
  {
    id: "download",
    label: "Download",
    description:
      "Bulk-download Storyblok data as JSON files to disk. Use this to create a local snapshot of components, stories, and assets before running the migration to Sanity.",
  },
];

type Props = {
  initialStatuses: Record<MigrationResource, DownloadStatus | null> | null;
  initialSpace: StoryblokSpace | null;
};

export function MigrationDashboard({ initialStatuses, initialSpace }: Props) {
  const [activeSection, setActiveSection] = useState<SectionId>("storyblok");
  const [activeStoryblokTab, setActiveStoryblokTab] = useState<StoryblokTabId>("components");

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Top-level section tabs */}
      <div className="flex gap-1 rounded-md border border-neutral-200 bg-white p-1">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => !section.disabled && setActiveSection(section.id)}
            disabled={section.disabled}
            className={`rounded px-5 py-2.5 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "bg-neutral-900 text-white"
                : section.disabled
                  ? "cursor-not-allowed text-neutral-300"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            {section.label}
            {section.disabled && (
              <span className="ml-1.5 text-[10px] font-normal opacity-60">soon</span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        {SECTIONS.find((s) => s.id === activeSection)?.description}
      </div>

      {/* Storyblok section */}
      {activeSection === "storyblok" && (
        <>
          <SpaceVerification initialSpace={initialSpace} />

          <div className="flex gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-1">
            {STORYBLOK_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStoryblokTab(tab.id)}
                className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                  activeStoryblokTab === tab.id
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:bg-white/50 hover:text-neutral-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
            {STORYBLOK_TABS.find((t) => t.id === activeStoryblokTab)?.description}
          </div>

          {activeStoryblokTab === "components" && <ComponentsTab />}
          {activeStoryblokTab === "stories" && <StoriesTab />}
          {activeStoryblokTab === "assets" && <AssetsTab />}
          {activeStoryblokTab === "download" && <DownloadPanel initialStatuses={initialStatuses} />}
        </>
      )}

      {/* Mapping section */}
      {activeSection === "mapping" && <MappingTab />}

      {/* Sanity section */}
      {activeSection === "sanity" && <SanityTab />}
    </div>
  );
}
