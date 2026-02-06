"use client";

import { useState } from "react";
import { Hero } from "@/components/hero/hero.component";
import { Container } from "@/components/layout/container.component";
import type { HeroData } from "@/server/queries/utils/hero.query";

// Helper to create mock data with type assertions for dev testing
const createMockHero = (partial: Record<string, unknown>) => partial as unknown as HeroData;

// Mock link data
const mockLinks = [
  {
    _key: "link1",
    linkType: "internal",
    title: "Primary Action",
    slug: "services",
    _type: "service",
    description: null,
    buttonVariant: "primary",
  },
  {
    _key: "link2",
    linkType: "external",
    title: "Secondary Action",
    url: "https://example.com",
    description: null,
    buttonVariant: "secondary",
  },
];

// Mock excerpt (portable text)
const mockExcerpt = [
  {
    _key: "block1",
    _type: "block",
    _ts: "PortableTextInnerQuery",
    children: [
      {
        _key: "span1",
        _type: "span",
        text: "This is a sample excerpt text that demonstrates how the hero component displays rich text content. It can span multiple lines and provides context for the page.",
        marks: [],
      },
    ],
    markDefs: [],
    style: "normal",
  },
];

// Mock image data - using real Sanity asset ID
const mockImage = {
  asset: {
    _id: "image-c0abde82d7e54146e5e9bc92c4fd62693a1db6a6-680x907-png",
    metadata: {
      lqip: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAANCAYAAACQN/8FAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA",
    },
  },
  altText: "Sample hero image",
  caption: null,
  crop: null,
  hotspot: null,
};

// Types
type HeroType = "media" | "article" | "sticky";
type MediaType = "image" | "video" | "illustration";
type MediaCount = 1 | 2;
type WidgetType = "none" | "default" | "event";

// Tab button component
function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-container-brand-1 text-text-white-primary"
          : "bg-container-shade text-primary hover:bg-container-secondary"
      }`}
    >
      {children}
    </button>
  );
}

// Control panel for options
function ControlPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-secondary">{label}:</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

// Hero builders
function buildMediaHero(mediaType: MediaType, widgetType: WidgetType): HeroData {
  const media = {
    mediaType,
    image: mediaType === "image" ? mockImage : null,
    videoUrl: mediaType === "video" ? "https://vimeo.com/76979871" : null,
    videoDisplayMode: null,
    videoPlaceholder: null,
    illustration: mediaType === "illustration" ? "rocket" : null,
    aspectRatio: mediaType !== "illustration" ? "3:2" : null,
  };

  const widget =
    widgetType === "none"
      ? null
      : {
          useWidget: true,
          widgetType,
          defaultTitle: widgetType === "default" ? "Widget Title" : null,
          defaultContent:
            widgetType === "default"
              ? [
                  {
                    _key: "widget-block1",
                    _type: "block",
                    children: [
                      {
                        _key: "widget-span1",
                        _type: "span",
                        text: "This is widget content that appears in a floating overlay on the hero image.",
                        marks: [],
                      },
                    ],
                    markDefs: [],
                    style: "normal",
                  },
                ]
              : null,
          defaultLinks: widgetType === "default" ? [mockLinks[0]] : null,
          eventSelectionMode: widgetType === "event" ? "auto" : null,
          eventReference:
            widgetType === "event"
              ? {
                  _id: "mock-event-1",
                  title: "Upcoming Event",
                  excerpt: [
                    {
                      _key: "event-block1",
                      _type: "block",
                      children: [
                        {
                          _key: "event-span1",
                          _type: "span",
                          text: "Join us for this exciting event.",
                          marks: [],
                        },
                      ],
                      markDefs: [],
                      style: "normal",
                    },
                  ],
                  slug: "upcoming-event",
                  timeAndDate: {
                    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    endTime: null,
                  },
                }
              : null,
          formTitle: null,
          formReference: null,
          newsletterForm: null,
        };

  return createMockHero({
    heroType: "mediaHero",
    mediaHero: {
      title: "Media Hero: Centered Layout",
      media,
      excerpt: mockExcerpt,
      links: mockLinks,
      widget,
    },
    articleHero: null,
    stickyHero: null,
  });
}

function buildArticleHero(mediaCount: MediaCount, hasAuthor: boolean): HeroData {
  const mediaItems = Array.from({ length: mediaCount }, (_, i) => ({
    _key: `media-${i}`,
    mediaType: "image" as const,
    image: mockImage,
    videoUrl: null,
    videoDisplayMode: null,
    videoPlaceholder: null,
    aspectRatio: "3:2" as const,
  }));

  const byline = hasAuthor
    ? {
        author: {
          _id: "author-1",
          name: "John Doe",
          slug: "john-doe",
          role: "Senior Consultant",
          image: null,
        },
        date: new Date().toISOString(),
      }
    : {
        author: null,
        date: new Date().toISOString(),
      };

  return createMockHero({
    heroType: "articleHero",
    mediaHero: null,
    articleHero: {
      title: `Article Hero: ${mediaCount === 1 ? "Single" : "Dual"} Media`,
      subheading: "A subheading that provides additional context below the title",
      media: mediaItems,
      byline,
      excerpt: mockExcerpt,
    },
    stickyHero: null,
  });
}

function buildStickyHero(mediaType: MediaType): HeroData {
  const media = {
    mediaType,
    image: mediaType === "image" ? mockImage : null,
    videoUrl: mediaType === "video" ? "https://vimeo.com/76979871" : null,
    videoDisplayMode: null,
    videoPlaceholder: null,
    illustration: mediaType === "illustration" ? "rocket" : null,
    aspectRatio: mediaType !== "illustration" ? "3:4" : null,
  };

  return createMockHero({
    heroType: "stickyHero",
    mediaHero: null,
    articleHero: null,
    stickyHero: {
      title: "Sticky Hero: Two-Column Layout",
      media,
      excerpt: mockExcerpt,
      links: mockLinks,
    },
  });
}

export default function HeroDevPage() {
  const [heroType, setHeroType] = useState<HeroType>("media");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [widgetType, setWidgetType] = useState<WidgetType>("none");
  const [mediaCount, setMediaCount] = useState<MediaCount>(1);
  const [hasAuthor, setHasAuthor] = useState(true);

  // Build the current hero based on selections
  const getCurrentHero = (): HeroData => {
    switch (heroType) {
      case "media":
        return buildMediaHero(mediaType, widgetType);
      case "article":
        return buildArticleHero(mediaCount, hasAuthor);
      case "sticky":
        return buildStickyHero(mediaType);
    }
  };

  const showMediaOptions = heroType === "media" || heroType === "sticky";
  const showWidgetOptions = heroType === "media";
  const showArticleOptions = heroType === "article";

  return (
    <div className="min-h-screen bg-container-shade">
      <Container>
        <div className="py-md">
          <h1 className="text-[30px] font-semibold leading-[110%] text-primary lg:text-[42px]">
            Hero Components Test Page
          </h1>
          <p className="mt-2 text-secondary">
            Toggle between hero types and variants using the controls below.
          </p>
        </div>
      </Container>

      {/* Controls */}
      <Container>
        <div className="mb-8 flex flex-wrap gap-6 rounded-sm border border-stroke-soft bg-container-primary p-4">
          <ControlPanel label="Hero Type">
            <Tab active={heroType === "media"} onClick={() => setHeroType("media")}>
              Media
            </Tab>
            <Tab active={heroType === "article"} onClick={() => setHeroType("article")}>
              Article
            </Tab>
            <Tab active={heroType === "sticky"} onClick={() => setHeroType("sticky")}>
              Sticky
            </Tab>
          </ControlPanel>

          {showMediaOptions && (
            <ControlPanel label="Media Type">
              <Tab active={mediaType === "image"} onClick={() => setMediaType("image")}>
                Image
              </Tab>
              <Tab active={mediaType === "video"} onClick={() => setMediaType("video")}>
                Video
              </Tab>
              <Tab
                active={mediaType === "illustration"}
                onClick={() => setMediaType("illustration")}
              >
                Illustration
              </Tab>
            </ControlPanel>
          )}

          {showWidgetOptions && (
            <ControlPanel label="Widget">
              <Tab active={widgetType === "none"} onClick={() => setWidgetType("none")}>
                None
              </Tab>
              <Tab active={widgetType === "default"} onClick={() => setWidgetType("default")}>
                Default
              </Tab>
              <Tab active={widgetType === "event"} onClick={() => setWidgetType("event")}>
                Event
              </Tab>
            </ControlPanel>
          )}

          {showArticleOptions && (
            <>
              <ControlPanel label="Media Items">
                <Tab active={mediaCount === 1} onClick={() => setMediaCount(1)}>
                  1
                </Tab>
                <Tab active={mediaCount === 2} onClick={() => setMediaCount(2)}>
                  2
                </Tab>
              </ControlPanel>
              <ControlPanel label="Author">
                <Tab active={hasAuthor} onClick={() => setHasAuthor(true)}>
                  With Author
                </Tab>
                <Tab active={!hasAuthor} onClick={() => setHasAuthor(false)}>
                  No Author
                </Tab>
              </ControlPanel>
            </>
          )}
        </div>
      </Container>

      {/* Current config display */}
      <Container>
        <div className="mb-4 rounded-sm bg-container-secondary px-4 py-2">
          <span className="font-mono text-sm text-primary">
            {heroType}Hero
            {showMediaOptions && ` / ${mediaType}`}
            {showWidgetOptions && ` / widget: ${widgetType}`}
            {showArticleOptions && ` / ${mediaCount} media / ${hasAuthor ? "with" : "no"} author`}
          </span>
        </div>
      </Container>

      {/* Hero preview */}
      <Hero hero={getCurrentHero()} />

      {/* Description */}
      <Container className="py-xl">
        <div className="max-w-[720px]">
          <h2 className="mb-md text-xl font-semibold text-primary">Hero Types</h2>
          <div className="flex flex-col gap-md text-base text-secondary">
            <div>
              <h3 className="font-semibold text-primary">Media Hero</h3>
              <p>
                Centered layout with title, excerpt, and CTA links above a full-width media element.
                Supports an optional widget overlay (default, event, form, or newsletter).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary">Article Hero</h3>
              <p>
                Editorial layout for articles and case studies. Features a byline with author and
                date, subheading, and supports 1-2 media items displayed below the content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary">Sticky Hero</h3>
              <p>
                Two-column layout where the media stays fixed (sticky) on desktop while content
                scrolls. Ideal for long-form content pages with a visual anchor.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
