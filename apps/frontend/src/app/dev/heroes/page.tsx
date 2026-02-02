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
type HeroType = "text" | "media" | "article" | "form";
type MediaType = "image" | "video" | "illustration";
type AspectRatio = "3:2" | "3:4" | "1:1";
type CoverImageCount = 1 | 2 | 3;

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
function buildTextHero(): HeroData {
  return createMockHero({
    heroType: "textHero",
    textHero: {
      title: "Text Hero: Simple & Clean",
      excerpt: mockExcerpt,
      links: mockLinks,
    },
    mediaHero: null,
    articleHero: null,
    formHero: null,
  });
}

function buildMediaHero(mediaType: MediaType, aspectRatio: AspectRatio): HeroData {
  const media = {
    mediaType,
    image: mediaType === "image" ? mockImage : null,
    videoUrl: mediaType === "video" ? "https://vimeo.com/76979871" : null,
    illustration: mediaType === "illustration" ? "rocket" : null,
    aspectRatio: mediaType !== "illustration" ? aspectRatio : null,
  };

  return createMockHero({
    heroType: "mediaHero",
    textHero: null,
    mediaHero: {
      title: `Media Hero: ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`,
      media,
      excerpt: mockExcerpt,
      links: mockLinks,
    },
    articleHero: null,
    formHero: null,
  });
}

function buildArticleHero(coverImageCount: CoverImageCount): HeroData {
  const coverImages = Array.from({ length: coverImageCount }, () => ({
    mediaType: "image",
    image: mockImage,
    videoUrl: null,
    illustration: null,
    aspectRatio: "3:2",
  }));

  return createMockHero({
    heroType: "articleHero",
    textHero: null,
    mediaHero: null,
    articleHero: {
      title: `Article Hero: ${coverImageCount} Cover Image${coverImageCount > 1 ? "s" : ""}`,
      coverImages,
      author: {
        _id: "author-1",
        name: "John Doe",
        image: null,
      },
      publishDate: new Date().toISOString(),
      excerpt: mockExcerpt,
    },
    formHero: null,
  });
}

function buildFormHero(mediaType: MediaType, aspectRatio: AspectRatio): HeroData {
  const media = {
    mediaType,
    image: mediaType === "image" ? mockImage : null,
    videoUrl: mediaType === "video" ? "https://vimeo.com/76979871" : null,
    illustration: mediaType === "illustration" ? "rocket" : null,
    aspectRatio: mediaType !== "illustration" ? aspectRatio : null,
  };

  return createMockHero({
    heroType: "formHero",
    textHero: null,
    mediaHero: null,
    articleHero: null,
    formHero: {
      title: "Form Hero: Lead Generation",
      media,
      form: {
        _id: "form-1",
        title: "Contact Form",
        formId: "hubspot-form-id",
      },
    },
  });
}

export default function HeroDevPage() {
  const [heroType, setHeroType] = useState<HeroType>("media");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("3:2");
  const [coverImageCount, setCoverImageCount] = useState<CoverImageCount>(1);

  // Build the current hero based on selections
  const getCurrentHero = (): HeroData => {
    switch (heroType) {
      case "text":
        return buildTextHero();
      case "media":
        return buildMediaHero(mediaType, aspectRatio);
      case "article":
        return buildArticleHero(coverImageCount);
      case "form":
        return buildFormHero(mediaType, aspectRatio);
    }
  };

  const showMediaOptions = heroType === "media" || heroType === "form";
  const showAspectRatio = showMediaOptions && mediaType !== "illustration";
  const showCoverImageCount = heroType === "article";

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
            <Tab active={heroType === "text"} onClick={() => setHeroType("text")}>
              Text
            </Tab>
            <Tab active={heroType === "media"} onClick={() => setHeroType("media")}>
              Media
            </Tab>
            <Tab active={heroType === "article"} onClick={() => setHeroType("article")}>
              Article
            </Tab>
            <Tab active={heroType === "form"} onClick={() => setHeroType("form")}>
              Form
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

          {showAspectRatio && (
            <ControlPanel label="Aspect Ratio">
              <Tab active={aspectRatio === "3:2"} onClick={() => setAspectRatio("3:2")}>
                3:2
              </Tab>
              <Tab active={aspectRatio === "3:4"} onClick={() => setAspectRatio("3:4")}>
                3:4
              </Tab>
              <Tab active={aspectRatio === "1:1"} onClick={() => setAspectRatio("1:1")}>
                1:1
              </Tab>
            </ControlPanel>
          )}

          {showCoverImageCount && (
            <ControlPanel label="Cover Images">
              <Tab active={coverImageCount === 1} onClick={() => setCoverImageCount(1)}>
                1
              </Tab>
              <Tab active={coverImageCount === 2} onClick={() => setCoverImageCount(2)}>
                2
              </Tab>
              <Tab active={coverImageCount === 3} onClick={() => setCoverImageCount(3)}>
                3
              </Tab>
            </ControlPanel>
          )}
        </div>
      </Container>

      {/* Current config display */}
      <Container>
        <div className="mb-4 rounded-sm bg-container-secondary px-4 py-2">
          <span className="font-mono text-sm text-primary">
            {heroType}Hero
            {showMediaOptions && ` / ${mediaType}`}
            {showAspectRatio && ` / ${aspectRatio}`}
            {showCoverImageCount && ` / ${coverImageCount} image${coverImageCount > 1 ? "s" : ""}`}
          </span>
        </div>
      </Container>

      {/* Hero preview */}
      <Hero hero={getCurrentHero()} />
    </div>
  );
}
