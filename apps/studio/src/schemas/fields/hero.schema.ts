import { Image, Newspaper, PanelLeftDashed } from "lucide-react";
import { defineField, defineType } from "sanity";

import { datetimeField } from "@/schemas/generator-fields/datetime.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";

/**
 * Sticky Hero
 * A two-column hero where media stays sticky while content scrolls
 */
export const stickyHeroSchema = defineType({
  name: "stickyHero",
  title: "Sticky Hero",
  type: "object",
  icon: PanelLeftDashed,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      description: "The main heading displayed in the hero section",
      required: true,
    }),
    mediaField({
      name: "media",
      title: "Media",
      description: "Hero image or video (stays sticky on desktop)",
      video: true,
    }),
    portableTextField({
      name: "excerpt",
      title: "Excerpt",
      description: "A brief summary or introduction",
      noContent: true,
      includeLists: true,
    }),
    linksField({
      name: "links",
      title: "Links",
      description: "Call-to-action buttons (max 2)",
      includeExternal: true,
      includeDownload: true,
      max: 2,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "media.image.asset",
    },
    prepare({ title, media }) {
      return {
        title: title || "Sticky Hero",
        subtitle: "Sticky Hero",
        media,
      };
    },
  },
});

/**
 * Media Hero
 * A general-purpose hero with title, media (image/video/illustration), excerpt, and links
 */
export const mediaHeroSchema = defineType({
  name: "mediaHero",
  title: "Media Hero",
  type: "object",
  icon: Image,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      description: "The main heading displayed in the hero section",
      required: true,
    }),
    mediaField({
      name: "media",
      title: "Media",
      description: "Hero image, video, or illustration",
      video: true,
      illustration: true,
    }),
    portableTextField({
      name: "excerpt",
      title: "Excerpt",
      description: "A brief summary or introduction",
      noContent: true,
      includeLists: true,
    }),
    linksField({
      name: "links",
      title: "Links",
      description: "Call-to-action buttons (max 2)",
      includeExternal: true,
      includeDownload: true,
      max: 2,
    }),
    defineField({
      name: "widget",
      title: "Widget",
      type: "widget",
      description: "Optional widget displayed alongside the hero content",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "media.image.asset",
    },
    prepare({ title, media }) {
      return {
        title: title || "Media Hero",
        subtitle: "Media Hero",
        media,
      };
    },
  },
});

/**
 * Byline schema for article attribution
 * Groups author reference and publish date together
 */
export const bylineSchema = defineType({
  name: "byline",
  title: "Byline",
  type: "object",
  fields: [
    referenceField({
      name: "author",
      title: "Author",
      description: "The article author",
      to: [{ type: "person" }],
    }),
    datetimeField({
      name: "date",
      title: "Date",
      description: "Publication date",
      required: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      authorName: "author.name",
      date: "date",
    },
    prepare({ authorName, date }) {
      const dateStr = date ? new Date(date).toLocaleDateString("no") : "";
      return {
        title: authorName || "No author",
        subtitle: dateStr,
      };
    },
  },
});

/**
 * Article Hero (legacy type for heroField selector)
 * For editorial content with byline support (author, publish date, cover media)
 *
 * Note: For document-specific article heroes, use articleHeroField() generator instead.
 * Labels are resolved in frontend from document _type via string translations.
 *
 * Fields (all optional except title):
 * - title: Main headline (required)
 * - subheading: Text below title
 * - excerpt: Brief summary (portable text)
 * - byline: Author + date attribution
 * - media: Cover image or video
 */
export const articleHeroSchema = defineType({
  name: "articleHero",
  title: "Article Hero",
  type: "object",
  icon: Newspaper,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      description: "The article headline",
      required: true,
    }),
    stringField({
      name: "subheading",
      title: "Subheading",
      description: "Text displayed below the title",
    }),
    portableTextField({
      name: "excerpt",
      title: "Excerpt",
      description: "A brief summary of the article",
      noContent: true,
      includeLists: true,
    }),
    defineField({
      name: "byline",
      title: "Byline",
      description: "Author and publication date",
      type: "byline",
    }),
    defineField({
      name: "media",
      title: "Cover media",
      description: "Cover images or video (max 2)",
      type: "array",
      of: [mediaField({ name: "mediaItem", video: true, aspectRatio: false })],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "media.0.image.asset",
      authorName: "byline.author.name",
    },
    prepare({ title, media, authorName }) {
      return {
        title: title || "Article Hero",
        subtitle: authorName ? `Article Hero · ${authorName}` : "Article Hero",
        media,
      };
    },
  },
});

/**
 * Hero wrapper schema with type selector
 * Allows editors to choose between different hero presentations
 */
export const heroSchema = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroType",
      title: "Hero type",
      description: "Choose the hero presentation style",
      type: "string",
      options: {
        list: [
          { title: "Media", value: "mediaHero" },
          { title: "Article", value: "articleHero" },
          { title: "Sticky", value: "stickyHero" },
        ],
        layout: "dropdown",
      },
      initialValue: "mediaHero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mediaHero",
      title: "Media Hero",
      type: "mediaHero",
      hidden: ({ parent }) => parent?.heroType !== "mediaHero",
    }),
    defineField({
      name: "articleHero",
      title: "Article Hero",
      type: "articleHero",
      hidden: ({ parent }) => parent?.heroType !== "articleHero",
    }),
    defineField({
      name: "stickyHero",
      title: "Sticky Hero",
      type: "stickyHero",
      hidden: ({ parent }) => parent?.heroType !== "stickyHero",
    }),
  ],
  preview: {
    select: {
      heroType: "heroType",
      mediaHeroTitle: "mediaHero.title",
      articleHeroTitle: "articleHero.title",
      stickyHeroTitle: "stickyHero.title",
      mediaHeroMedia: "mediaHero.media.image.asset",
      articleHeroMedia: "articleHero.media.image.asset",
      stickyHeroMedia: "stickyHero.media.image.asset",
    },
    prepare({
      heroType,
      mediaHeroTitle,
      articleHeroTitle,
      stickyHeroTitle,
      mediaHeroMedia,
      articleHeroMedia,
      stickyHeroMedia,
    }) {
      const typeLabels: Record<string, string> = {
        mediaHero: "Media",
        articleHero: "Article",
        stickyHero: "Sticky",
      };

      const titleMap: Record<string, string | undefined> = {
        mediaHero: mediaHeroTitle,
        articleHero: articleHeroTitle,
        stickyHero: stickyHeroTitle,
      };

      // Get the appropriate media based on hero type
      const media =
        heroType === "mediaHero"
          ? mediaHeroMedia
          : heroType === "articleHero"
            ? articleHeroMedia
            : heroType === "stickyHero"
              ? stickyHeroMedia
              : undefined;

      return {
        title: titleMap[heroType] || "Hero",
        subtitle: typeLabels[heroType] || heroType,
        media,
      };
    },
  },
});
