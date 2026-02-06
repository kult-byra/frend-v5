"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  type BlockMapping,
  type DocumentMapping,
  loadMappingConfig,
  type MappingStatus,
  saveMappingConfig,
} from "@/server/actions/storyblok-migration.action";

// ---- Available Sanity types for dropdowns ----

const SANITY_DOCUMENT_TYPES = [
  // Content documents
  "page",
  "frontPage",
  "conversionPage",
  "newsArticle",
  "event",
  "knowledgeArticle",
  "seminar",
  "caseStudy",
  "eBook",
  "client",
  "jobOpening",
  // Archive / singleton pages
  "newsAndEventsArchive",
  "knowledgeHub",
  "knowledgeArticleArchive",
  "caseStudyArchive",
  "seminarArchive",
  "eBookArchive",
  "servicesArchive",
  "clientArchive",
  // Support documents
  "service",
  "subService",
  "person",
  "quote",
  "logo",
  "technology",
  "industry",
  "eventType",
  "hubspotForm",
  "isometricIllustration",
  "organisationSettings",
  // Settings (singletons)
  "siteSettings",
  "footerSettings",
  "menuSettings",
  "metadataSettings",
  "newsletterSettings",
  "stringTranslations",
] as const;

const SANITY_BLOCK_TYPES = [
  // Page builder blocks (schema name = without .block suffix)
  "content",
  "cards",
  "quotes",
  "people",
  "logoCloud",
  "jobOpenings",
  "mediaGallery",
  // Portable text / inline blocks
  "accordions",
  "button",
  "video",
  "form",
  "callToAction",
  "figure",
  // Hero types
  "articleHero",
  "mediaHero",
  "stickyHero",
  // Field object types
  "widget",
  "byline",
  "internalLink",
  "externalLink",
  // Special mappings (not schema names, but migration targets)
  "portableText",
  "portableText (heading)",
  "portableText (list)",
  "excerpt field",
] as const;

// ---- Default data (used to seed initial JSON) ----

const DEFAULT_DOCUMENT_MAPPINGS: DocumentMapping[] = [
  {
    storyblok: "Article",
    storyblokDisplay: "Article",
    sanity: "knowledgeArticle",
    status: "todo",
    storyCount: 77,
    exampleSlug: "artikler/tre-grunner-til-at-dere-bor-slutte-a-sende-e-post-internt",
    notes: "Knowledge articles with rich body content",
  },
  {
    storyblok: "News",
    storyblokDisplay: "News",
    sanity: "newsArticle",
    status: "todo",
    storyCount: 40,
    exampleSlug: "nyheter/frend-1-ar-martin-og-henrik-ser-tilbake-pa-aret-som-var",
    notes: "News articles",
  },
  {
    storyblok: "EBook",
    storyblokDisplay: "EBook",
    sanity: "eBook",
    status: "todo",
    storyCount: 34,
    exampleSlug: "e-boker/presentasjon-automatisering-med-ai",
    notes: "Downloadable e-books",
  },
  {
    storyblok: "Webinar",
    storyblokDisplay: "Webinar",
    sanity: "seminar",
    status: "todo",
    storyCount: 2,
    exampleSlug: "webinar/webinar-bli-enda-bedre-i-teams",
    notes: "Webinars → Sanity seminars",
  },
  {
    storyblok: "Arrangmement",
    storyblokDisplay: "Arrangmement (Event)",
    sanity: "event",
    status: "todo",
    storyCount: 37,
    exampleSlug: "arrangementer/seminar-utnytt-ai-mulighetene-i-sharepoint-og-teams",
    notes: "Events with date, location, speakers",
  },
  {
    storyblok: "project",
    storyblokDisplay: "Project",
    sanity: "caseStudy",
    status: "todo",
    storyCount: 124,
    exampleSlug: "prosjekter/holzweiler-nettbutikk",
    notes: "Projects → Sanity case studies",
  },
  {
    storyblok: "Service",
    storyblokDisplay: "Service",
    sanity: "service",
    status: "todo",
    storyCount: 31,
    exampleSlug: "tjenester/plattformer/crm-gammel",
    notes: "Service pages",
  },
  {
    storyblok: "Person",
    storyblokDisplay: "Person",
    sanity: "person",
    status: "todo",
    storyCount: 88,
    exampleSlug: "employees/gemma-prescott",
    notes: "People/employees with name, role, image, contact",
  },
  {
    storyblok: "Landing",
    storyblokDisplay: "Landing",
    sanity: "page",
    status: "todo",
    storyCount: 58,
    exampleSlug: "kontakt",
    notes: "Landing pages → generic pages with page builder",
  },
  {
    storyblok: "Page",
    storyblokDisplay: "Page",
    sanity: "page",
    status: "todo",
    storyCount: 1,
    exampleSlug: "karriere/studentarrangementet-frend-for-en-kveld",
    notes: "Generic pages",
  },
  {
    storyblok: "HubspotPage",
    storyblokDisplay: "HubspotPage",
    sanity: "conversionPage",
    status: "todo",
    storyCount: 72,
    exampleSlug: "innholdssider/kaffe",
    notes: "HubSpot form pages → conversion pages",
  },
  {
    storyblok: "Jobs",
    storyblokDisplay: "Jobs",
    sanity: "jobOpening",
    status: "todo",
    storyCount: 60,
    exampleSlug: "karriere/digital-workplace/ai-utvikler",
    notes: "Job listings",
  },
  {
    storyblok: "Video",
    storyblokDisplay: "Video",
    sanity: null,
    status: "todo",
    storyCount: 288,
    exampleSlug: "videoer/intro-AI-anno-oktober-2025",
    notes: "Video content — needs mapping decision",
  },
  {
    storyblok: "Kunnskap",
    storyblokDisplay: "Kunnskap",
    sanity: "knowledgeArticle",
    status: "todo",
    storyCount: 1,
    exampleSlug: "kunnskap",
    notes: "Knowledge content — may overlap with Article",
  },
  {
    storyblok: "videoSlider",
    storyblokDisplay: "VideoSlider",
    sanity: null,
    status: "skip",
    storyCount: 24,
    exampleSlug: "videosamlinger/automatisering-med-ai",
    notes: "Video slider collections — likely handled as block or skipped",
  },
  {
    storyblok: "root",
    storyblokDisplay: "Root",
    sanity: null,
    status: "skip",
    storyCount: 3,
    exampleSlug: null,
    notes: "Folder/root nodes — not content documents",
  },
  {
    storyblok: "_uncategorized",
    storyblokDisplay: "Uncategorized",
    sanity: null,
    status: "todo",
    storyCount: 21,
    exampleSlug: null,
    notes: "Uncategorized stories — need manual review",
  },
];

const DEFAULT_BLOCK_MAPPINGS: BlockMapping[] = [
  // Heroes
  {
    storyblok: "hero",
    storyblokDisplay: "Hero",
    sanity: "mediaHero",
    status: "todo",
    notes: "Main hero → pick Sanity hero type based on content",
  },
  {
    storyblok: "heroWithImage",
    storyblokDisplay: "Hero with Image",
    sanity: "mediaHero",
    status: "todo",
    notes: "Hero with image → mediaHero",
  },
  {
    storyblok: "heroSmallImage",
    storyblokDisplay: "Hero (small image)",
    sanity: "articleHero",
    status: "todo",
    notes: "Smaller hero → articleHero",
  },
  {
    storyblok: "heroFrontpage",
    storyblokDisplay: "Hero Frontpage",
    sanity: "mediaHero",
    status: "todo",
    notes: "Front page hero",
  },
  {
    storyblok: "heroEvent",
    storyblokDisplay: "Hero Event",
    sanity: "articleHero",
    status: "todo",
    notes: "Event hero → articleHero with event data",
  },
  {
    storyblok: "heroWithHighlight",
    storyblokDisplay: "Hero with Highlight",
    sanity: "mediaHero",
    status: "todo",
    notes: "Hero with highlight → mediaHero with widget",
  },
  {
    storyblok: "heroHowWeWork",
    storyblokDisplay: "Hero How We Work",
    sanity: "stickyHero",
    status: "todo",
    notes: "Two-column hero",
  },
  {
    storyblok: "FormHero",
    storyblokDisplay: "Form Hero",
    sanity: "mediaHero",
    status: "todo",
    notes: "Hero with form embed",
  },
  // Body content
  {
    storyblok: "bodyParagraph",
    storyblokDisplay: "Paragraph (rich text)",
    sanity: "portableText",
    status: "todo",
    notes: "Rich text blocks → Sanity portable text",
  },
  {
    storyblok: "bodyTitle",
    storyblokDisplay: "Title/Heading",
    sanity: "portableText (heading)",
    status: "todo",
    notes: "Heading → portable text heading block",
  },
  {
    storyblok: "bodyBigText",
    storyblokDisplay: "Ingress / Lead text",
    sanity: "excerpt field",
    status: "todo",
    notes: "Intro text → excerpt or lead text field",
  },
  {
    storyblok: "bodyImage",
    storyblokDisplay: "Body Image",
    sanity: "figure",
    status: "todo",
    notes: "Inline image → figure block in page builder",
  },
  {
    storyblok: "paragraphImage",
    storyblokDisplay: "Paragraph Image",
    sanity: "figure",
    status: "todo",
    notes: "Image with caption/credit",
  },
  {
    storyblok: "bodyVideo",
    storyblokDisplay: "Body Video",
    sanity: "video",
    status: "todo",
    notes: "Embedded video → video block",
  },
  // Layout blocks
  {
    storyblok: "accordion",
    storyblokDisplay: "Accordion",
    sanity: "accordions",
    status: "todo",
    notes: "Accordion with items",
  },
  {
    storyblok: "callToAction",
    storyblokDisplay: "Call to Action",
    sanity: "callToAction",
    status: "todo",
    notes: "CTA box",
  },
  {
    storyblok: "textWithImage",
    storyblokDisplay: "Text with Image",
    sanity: "content",
    status: "todo",
    notes: "Side-by-side text and image → content block",
  },
  {
    storyblok: "quote",
    storyblokDisplay: "Quote",
    sanity: "quotes",
    status: "todo",
    notes: "Blockquote → quotes block with reference",
  },
  {
    storyblok: "grid",
    storyblokDisplay: "Two Columns",
    sanity: "content",
    status: "todo",
    notes: "Two-column layout → content block",
  },
  {
    storyblok: "bigImage",
    storyblokDisplay: "Full-width Image",
    sanity: "figure",
    status: "todo",
    notes: "Large image → figure block (full width)",
  },
  {
    storyblok: "imageGrid",
    storyblokDisplay: "Image Grid",
    sanity: "mediaGallery",
    status: "todo",
    notes: "Image grid → media gallery block",
  },
  {
    storyblok: "imageScroll",
    storyblokDisplay: "Image Carousel",
    sanity: "mediaGallery",
    status: "todo",
    notes: "Image carousel → media gallery",
  },
  {
    storyblok: "imageGallery",
    storyblokDisplay: "Image Gallery",
    sanity: "mediaGallery",
    status: "todo",
    notes: "Gallery → media gallery block",
  },
  {
    storyblok: "numberedList",
    storyblokDisplay: "Numbered List",
    sanity: "portableText (list)",
    status: "todo",
    notes: "Numbered steps → portable text or custom block",
  },
  {
    storyblok: "LogoShowcase",
    storyblokDisplay: "Logo Showcase",
    sanity: "logoCloud",
    status: "todo",
    notes: "Logo grid → logo cloud block",
  },
  {
    storyblok: "hubspotForm",
    storyblokDisplay: "HubSpot Form",
    sanity: "form",
    status: "todo",
    notes: "HubSpot form embed → form block",
  },
  // Reference/collection blocks
  {
    storyblok: "featuredPeople",
    storyblokDisplay: "Featured People",
    sanity: "people",
    status: "todo",
    notes: "People references → people block",
  },
  {
    storyblok: "bigPerson",
    storyblokDisplay: "Contact Person",
    sanity: "people",
    status: "todo",
    notes: "Single person highlight → people block",
  },
  {
    storyblok: "projectHighlights",
    storyblokDisplay: "Project Highlights",
    sanity: "cards",
    status: "todo",
    notes: "Featured projects → cards block referencing case studies",
  },
  {
    storyblok: "projectHighlightsScroll",
    storyblokDisplay: "Projects Carousel",
    sanity: "cards",
    status: "todo",
    notes: "Projects carousel → cards block",
  },
  {
    storyblok: "relatedContentScroll",
    storyblokDisplay: "Related Content",
    sanity: "cards",
    status: "todo",
    notes: "Related content carousel → cards block",
  },
  {
    storyblok: "relatedServices",
    storyblokDisplay: "Related Services",
    sanity: "cards",
    status: "todo",
    notes: "Related services → cards block referencing services",
  },
  {
    storyblok: "newsHighlightsScroll",
    storyblokDisplay: "News Carousel",
    sanity: "cards",
    status: "todo",
    notes: "News carousel → cards block referencing news articles",
  },
  {
    storyblok: "jobHighlights",
    storyblokDisplay: "Job Highlights",
    sanity: "jobOpenings",
    status: "todo",
    notes: "Job listings → job openings block",
  },
  {
    storyblok: "speakerGrid",
    storyblokDisplay: "Speaker Grid",
    sanity: "people",
    status: "todo",
    notes: "Event speakers → people block",
  },
  {
    storyblok: "talksGrid",
    storyblokDisplay: "Talks Grid",
    sanity: null,
    status: "todo",
    notes: "Event talks/schedule — may need custom block or portable text",
  },
  // Utility / skip
  {
    storyblok: "banner",
    storyblokDisplay: "Banner",
    sanity: null,
    status: "todo",
    notes: "Site banner — likely a setting, not a block",
  },
  {
    storyblok: "serviceNavigation",
    storyblokDisplay: "Service Navigation",
    sanity: null,
    status: "skip",
    notes: "Navigation component — handled by Sanity structure",
  },
  {
    storyblok: "space",
    storyblokDisplay: "Spacer",
    sanity: null,
    status: "skip",
    notes: "Visual spacer — handled by CSS in new design",
  },
  {
    storyblok: "linkedinEmbed",
    storyblokDisplay: "LinkedIn Embed",
    sanity: null,
    status: "todo",
    notes: "LinkedIn post embed — may need custom block",
  },
];

// ---- Status config ----

const STATUS_CONFIG: Record<MappingStatus, { label: string; color: string }> = {
  mapped: { label: "Mapped", color: "bg-emerald-100 text-emerald-800" },
  partial: { label: "Partial", color: "bg-amber-100 text-amber-800" },
  skip: { label: "Skip", color: "bg-neutral-100 text-neutral-500" },
  todo: { label: "To Do", color: "bg-blue-100 text-blue-800" },
};

const ALL_STATUSES: MappingStatus[] = ["mapped", "partial", "todo", "skip"];
type FilterStatus = MappingStatus | "all";

// ---- Component ----

export function MappingTab() {
  const [docMappings, setDocMappings] = useState<DocumentMapping[]>([]);
  const [blockMappings, setBlockMappings] = useState<BlockMapping[]>([]);
  const [docFilter, setDocFilter] = useState<FilterStatus>("all");
  const [blockFilter, setBlockFilter] = useState<FilterStatus>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted mappings on mount
  useEffect(() => {
    loadMappingConfig().then((config) => {
      if (config) {
        setDocMappings(config.documentMappings);
        setBlockMappings(config.blockMappings);
        setLastUpdated(config.lastUpdated);
      } else {
        // First load — seed from defaults
        setDocMappings(DEFAULT_DOCUMENT_MAPPINGS);
        setBlockMappings(DEFAULT_BLOCK_MAPPINGS);
      }
      setIsLoading(false);
    });
  }, []);

  // Debounced save
  const persistMappings = useCallback((docs: DocumentMapping[], blocks: BlockMapping[]) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaveStatus("saving");

    saveTimeoutRef.current = setTimeout(async () => {
      const result = await saveMappingConfig({
        documentMappings: docs,
        blockMappings: blocks,
        lastUpdated: new Date().toISOString(),
      });
      if (result.success) {
        setSaveStatus("saved");
        setLastUpdated(new Date().toISOString());
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    }, 500);
  }, []);

  const updateDocMapping = useCallback(
    (index: number, updates: Partial<DocumentMapping>) => {
      setDocMappings((prev) => {
        const next = prev.map((m, i) => (i === index ? { ...m, ...updates } : m));
        persistMappings(next, blockMappings);
        return next;
      });
    },
    [blockMappings, persistMappings],
  );

  const updateBlockMapping = useCallback(
    (index: number, updates: Partial<BlockMapping>) => {
      setBlockMappings((prev) => {
        const next = prev.map((m, i) => (i === index ? { ...m, ...updates } : m));
        persistMappings(docMappings, next);
        return next;
      });
    },
    [docMappings, persistMappings],
  );

  const filteredDocs =
    docFilter === "all" ? docMappings : docMappings.filter((m) => m.status === docFilter);
  const filteredBlocks =
    blockFilter === "all" ? blockMappings : blockMappings.filter((m) => m.status === blockFilter);

  const docStats = {
    total: docMappings.length,
    mapped: docMappings.filter((m) => m.status === "mapped").length,
    partial: docMappings.filter((m) => m.status === "partial").length,
    skip: docMappings.filter((m) => m.status === "skip").length,
    todo: docMappings.filter((m) => m.status === "todo").length,
    totalStories: docMappings.reduce((sum, m) => sum + m.storyCount, 0),
  };

  const blockStats = {
    total: blockMappings.length,
    mapped: blockMappings.filter((m) => m.status === "mapped").length,
    partial: blockMappings.filter((m) => m.status === "partial").length,
    skip: blockMappings.filter((m) => m.status === "skip").length,
    todo: blockMappings.filter((m) => m.status === "todo").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-neutral-500">
        Loading mapping config...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Save indicator + JSON info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SaveIndicator status={saveStatus} />
          {lastUpdated && (
            <span className="text-xs text-neutral-400">
              Last saved: {new Date(lastUpdated).toLocaleString("no-NO")}
            </span>
          )}
        </div>
        <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-500">
          migration-data/mapping.json
        </span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md border border-neutral-200 bg-white p-5">
          <p className="text-sm font-medium text-neutral-500">Document Types</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">
            {docStats.mapped} / {docStats.total}
            <span className="ml-2 text-sm font-normal text-neutral-400">mapped</span>
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            {docStats.totalStories} total stories to migrate
          </p>
        </div>
        <div className="rounded-md border border-neutral-200 bg-white p-5">
          <p className="text-sm font-medium text-neutral-500">Block / Component Types</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">
            {blockStats.mapped} / {blockStats.total}
            <span className="ml-2 text-sm font-normal text-neutral-400">mapped</span>
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            {blockStats.skip} skipped, {blockStats.todo} to do
          </p>
        </div>
      </div>

      {/* Document Type Mappings */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Document Types
            <span className="ml-2 text-sm font-normal text-neutral-400">
              Storyblok root components → Sanity documents
            </span>
          </h2>
          <StatusFilter value={docFilter} onChange={setDocFilter} />
        </div>

        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Storyblok</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">→</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Sanity Type</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Stories</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Status</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((mapping) => {
                const realIndex = docMappings.indexOf(mapping);
                return (
                  <tr key={mapping.storyblok} className="border-t border-neutral-200">
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-neutral-900">
                      {mapping.storyblokDisplay}
                      {mapping.exampleSlug && (
                        <>
                          {" "}
                          <a
                            href={`https://frend.no/${mapping.exampleSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            (example)
                          </a>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-neutral-300">→</td>
                    <td className="px-4 py-2.5">
                      <TypeDropdown
                        value={mapping.sanity}
                        options={SANITY_DOCUMENT_TYPES}
                        onChange={(v) => updateDocMapping(realIndex, { sanity: v })}
                      />
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-neutral-600">
                      {mapping.storyCount}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusDropdown
                        value={mapping.status}
                        onChange={(v) => updateDocMapping(realIndex, { status: v })}
                      />
                    </td>
                    <td className="max-w-xs px-4 py-2.5">
                      <EditableNotes
                        value={mapping.notes}
                        onChange={(v) => updateDocMapping(realIndex, { notes: v })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Block Mappings */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Blocks / Components
            <span className="ml-2 text-sm font-normal text-neutral-400">
              Storyblok nestable components → Sanity page builder blocks
            </span>
          </h2>
          <StatusFilter value={blockFilter} onChange={setBlockFilter} />
        </div>

        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Storyblok</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">→</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Sanity Type</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Status</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlocks.map((mapping) => {
                const realIndex = blockMappings.indexOf(mapping);
                return (
                  <tr key={mapping.storyblok} className="border-t border-neutral-200">
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-neutral-900">
                      {mapping.storyblokDisplay}
                    </td>
                    <td className="px-4 py-2.5 text-neutral-300">→</td>
                    <td className="px-4 py-2.5">
                      <TypeDropdown
                        value={mapping.sanity}
                        options={SANITY_BLOCK_TYPES}
                        onChange={(v) => updateBlockMapping(realIndex, { sanity: v })}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusDropdown
                        value={mapping.status}
                        onChange={(v) => updateBlockMapping(realIndex, { status: v })}
                      />
                    </td>
                    <td className="max-w-xs px-4 py-2.5">
                      <EditableNotes
                        value={mapping.notes}
                        onChange={(v) => updateBlockMapping(realIndex, { notes: v })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ---- Sub-components ----

function TypeDropdown({
  value,
  options,
  onChange,
}: {
  value: string | null;
  options: readonly string[];
  onChange: (value: string | null) => void;
}) {
  return (
    <select
      value={value ?? "__none__"}
      onChange={(e) => onChange(e.target.value === "__none__" ? null : e.target.value)}
      className={`w-full rounded border px-2 py-1 font-mono text-xs ${
        value
          ? "border-neutral-300 bg-white text-neutral-900"
          : "border-dashed border-neutral-300 bg-neutral-50 text-neutral-400 italic"
      }`}
    >
      <option value="__none__">— unmapped —</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function StatusDropdown({
  value,
  onChange,
}: {
  value: MappingStatus;
  onChange: (value: MappingStatus) => void;
}) {
  const config = STATUS_CONFIG[value];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as MappingStatus)}
      className={`rounded border-0 px-2 py-0.5 text-xs font-medium ${config.color}`}
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_CONFIG[s].label}
        </option>
      ))}
    </select>
  );
}

function EditableNotes({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setIsEditing(false);
          if (draft !== value) onChange(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setIsEditing(false);
            if (draft !== value) onChange(draft);
          }
          if (e.key === "Escape") {
            setIsEditing(false);
            setDraft(value);
          }
        }}
        rows={2}
        className="w-full resize-none rounded border border-blue-300 bg-white px-2 py-1 text-xs text-neutral-700 outline-none ring-1 ring-blue-200"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="w-full cursor-text text-left text-xs text-neutral-500 hover:text-neutral-700"
      title="Click to edit"
    >
      {value || <span className="italic text-neutral-300">Add notes...</span>}
    </button>
  );
}

function SaveIndicator({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "idle") return null;

  const config = {
    saving: { text: "Saving...", color: "text-amber-600" },
    saved: { text: "Saved", color: "text-emerald-600" },
    error: { text: "Save failed", color: "text-red-600" },
  }[status];

  return <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>;
}

function StatusFilter({
  value,
  onChange,
}: {
  value: FilterStatus;
  onChange: (v: FilterStatus) => void;
}) {
  const options: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "mapped", label: "Mapped" },
    { value: "partial", label: "Partial" },
    { value: "todo", label: "To Do" },
    { value: "skip", label: "Skip" },
  ];

  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
