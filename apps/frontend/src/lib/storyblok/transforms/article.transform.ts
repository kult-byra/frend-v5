import "server-only";

import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getMigrationDir } from "@/lib/storyblok/migration-fs";
import {
  generateKey,
  type PTBlock,
  plainTextToPortableText,
  resetKeyCounter,
  type TipTapDoc,
  tipTapToPortableText,
} from "./richtext.transform";

// ---------- Storyblok Types ----------

type StoryblokAsset = {
  id: number;
  filename: string;
  alt?: string;
  title?: string;
  focus?: string | null;
  fieldtype?: string;
};

type StoryblokBodyBlock = {
  _uid: string;
  component: string;
  text?: string | TipTapDoc;
  title?: string;
  image?: StoryblokAsset;
  person?: string;
  link?: Record<string, unknown>;
  items?: StoryblokBodyBlock[];
  [key: string]: unknown;
};

type StoryblokArticleContent = {
  _uid: string;
  title: string;
  body: StoryblokBodyBlock[];
  image?: StoryblokAsset;
  author?: string;
  subtext?: string;
  component: "Article";
  metaFields?: {
    title?: string;
    description?: string;
    og_image?: string;
  };
  highlightTags?: string;
};

export type StoryblokArticleStory = {
  id: number;
  slug: string;
  full_slug: string;
  updated_at?: string;
  first_published_at?: string;
  published_at?: string;
  content: StoryblokArticleContent;
};

// ---------- Sanity Types ----------

export type SanityArticleDocument = {
  _id: string;
  _type: "knowledgeArticle";
  language: string;
  slug: { _type: "slug"; current: string };
  hero: {
    title: string;
    byline: {
      _type: "byline";
      date: string;
    };
    media?: Array<{
      _key: string;
      _type: "mediaItem";
      mediaType: "image";
      image: {
        _type: "image";
        asset: { _type: "reference"; _ref: string };
        altText?: string;
      };
    }>;
  };
  summary?: PTBlock[];
  content: PTBlock[];
};

export type ArticleTransformResult = {
  document: SanityArticleDocument;
  imageUrl: string | null;
  imageAlt: string | undefined;
  slug: string;
  warnings: string[];
};

// ---------- ID Map ----------

type IdMap = Record<string, string>;
let cachedIdMap: IdMap | null = null;

function getIdMapPath(): string {
  return join(getMigrationDir(), "id-maps", "article-ids.json");
}

function loadIdMap(): IdMap {
  if (cachedIdMap) return cachedIdMap;
  const path = getIdMapPath();
  if (!existsSync(path)) {
    cachedIdMap = {};
    return cachedIdMap;
  }
  cachedIdMap = JSON.parse(readFileSync(path, "utf-8")) as IdMap;
  return cachedIdMap;
}

function saveIdMap(map: IdMap): void {
  const dir = join(getMigrationDir(), "id-maps");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(getIdMapPath(), JSON.stringify(map, null, 2), "utf-8");
  cachedIdMap = map;
}

export function clearArticleIdMapCache() {
  cachedIdMap = null;
}

export function articleSanityId(slug: string): string {
  const map = loadIdMap();
  if (map[slug]) return map[slug];
  const id = randomUUID();
  map[slug] = id;
  saveIdMap(map);
  return id;
}

// ---------- Transform ----------

export function transformArticle(story: StoryblokArticleStory): ArticleTransformResult {
  const { content, slug } = story;
  const warnings: string[] = [];

  resetKeyCounter();

  const title = content.title?.trim() || "Untitled";

  // Date
  const date =
    story.first_published_at || story.published_at || story.updated_at || new Date().toISOString();

  // Author — text like "Tekst: Martin Fossedal", needs manual matching later
  if (content.author?.trim()) {
    warnings.push(`Author text: "${content.author}" — needs manual person reference`);
  }

  // Cover image
  const imageUrl = content.image?.filename || null;
  const imageAlt = content.image?.alt || content.image?.title || undefined;

  // Summary: use subtext field
  const summaryBlocks: PTBlock[] = [];
  if (content.subtext?.trim()) {
    summaryBlocks.push(...plainTextToPortableText(content.subtext));
  }

  // Content: convert body blocks
  const contentBlocks: PTBlock[] = [];

  for (const block of content.body ?? []) {
    switch (block.component) {
      case "bodyBigText": {
        const text = typeof block.text === "string" ? block.text : "";
        if (summaryBlocks.length === 0 && text.trim()) {
          // Use as summary if we don't have subtext
          summaryBlocks.push(...plainTextToPortableText(text));
        } else if (text.trim()) {
          contentBlocks.push(...plainTextToPortableText(text));
        }
        break;
      }

      case "bodyParagraph": {
        // Optional title becomes a heading
        if (block.title?.trim()) {
          contentBlocks.push(...plainTextToPortableText(block.title, "h2"));
        }
        // Rich text body
        if (block.text && typeof block.text === "object" && block.text.type === "doc") {
          contentBlocks.push(...tipTapToPortableText(block.text as TipTapDoc));
        }
        break;
      }

      case "bodyTitle": {
        const text = typeof block.text === "string" ? block.text : "";
        if (text.trim()) {
          contentBlocks.push(...plainTextToPortableText(text, "h2"));
        }
        break;
      }

      case "paragraphImage":
        if (block.image?.filename) {
          warnings.push(`Skipped inline image: ${block.image.filename.split("/").pop()}`);
        }
        break;

      case "bigPerson":
        warnings.push(`Skipped bigPerson block (person: ${block.person ?? "unknown"})`);
        break;

      case "bigLink":
        warnings.push(`Skipped bigLink: ${(block.label as string) || block.title || "untitled"}`);
        break;

      case "accordion":
        warnings.push(`Skipped accordion block (${block.items?.length ?? 0} items)`);
        break;

      case "textWithImage":
        warnings.push(`Skipped textWithImage block: ${block.title || "untitled"}`);
        break;

      case "bodyVideo":
        warnings.push(`Skipped bodyVideo block (vimeoId: ${block.vimeoId ?? "unknown"})`);
        break;

      // Layout/nav blocks — silently skip
      case "relatedContentScroll":
      case "space":
      case "newCta":
      case "sideBySide":
      case "imageGrid":
      case "imageScroll":
      case "LogoShowcase":
        break;

      default:
        warnings.push(`Skipped unknown body block: ${block.component}`);
        break;
    }
  }

  const document: SanityArticleDocument = {
    _id: articleSanityId(slug),
    _type: "knowledgeArticle",
    language: "no",
    slug: { _type: "slug", current: slug },
    hero: {
      title,
      byline: {
        _type: "byline",
        date,
      },
    },
    ...(summaryBlocks.length > 0 ? { summary: summaryBlocks } : {}),
    content: contentBlocks,
  };

  return { document, imageUrl, imageAlt, slug, warnings };
}
