import { FileText, Image, Newspaper } from "lucide-react";
import { defineField, defineType } from "sanity";

import { datetimeField } from "@/schemas/generator-fields/datetime.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";

/**
 * Text Hero
 * A minimal hero with title, excerpt, and optional links (no media)
 */
export const textHeroSchema = defineType({
  name: "textHero",
  title: "Text Hero",
  type: "object",
  icon: FileText,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      description: "The main heading displayed in the hero section",
      required: true,
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
    },
    prepare({ title }) {
      return {
        title: title || "Text Hero",
        subtitle: "Text Hero",
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
 * Article Hero
 * For editorial content with byline support (author, publish date, cover media)
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
    mediaField({
      name: "media",
      title: "Cover media",
      description: "Cover image or video",
      video: true,
    }),
    referenceField({
      name: "author",
      title: "Author",
      description: "The article author",
      to: [{ type: "person" }],
    }),
    datetimeField({
      name: "publishDate",
      title: "Publish date",
      description: "When the article was published",
      required: true,
      initialValue: () => new Date().toISOString(),
    }),
    portableTextField({
      name: "excerpt",
      title: "Excerpt",
      description: "A brief summary of the article",
      noContent: true,
      includeLists: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "media.image.asset",
      authorName: "author.name",
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
          { title: "Text", value: "textHero" },
          { title: "Media", value: "mediaHero" },
          { title: "Article", value: "articleHero" },
        ],
        layout: "radio",
      },
      initialValue: "mediaHero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "textHero",
      title: "Text Hero",
      type: "textHero",
      hidden: ({ parent }) => parent?.heroType !== "textHero",
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
  ],
  preview: {
    select: {
      heroType: "heroType",
      textHeroTitle: "textHero.title",
      mediaHeroTitle: "mediaHero.title",
      articleHeroTitle: "articleHero.title",
      mediaHeroMedia: "mediaHero.media.image.asset",
      articleHeroMedia: "articleHero.media.image.asset",
    },
    prepare({
      heroType,
      textHeroTitle,
      mediaHeroTitle,
      articleHeroTitle,
      mediaHeroMedia,
      articleHeroMedia,
    }) {
      const typeLabels: Record<string, string> = {
        textHero: "Text",
        mediaHero: "Media",
        articleHero: "Article",
      };

      const titleMap: Record<string, string | undefined> = {
        textHero: textHeroTitle,
        mediaHero: mediaHeroTitle,
        articleHero: articleHeroTitle,
      };

      // Get the appropriate media based on hero type
      const media =
        heroType === "mediaHero"
          ? mediaHeroMedia
          : heroType === "articleHero"
            ? articleHeroMedia
            : undefined;

      return {
        title: titleMap[heroType] || "Hero",
        subtitle: typeLabels[heroType] || heroType,
        media,
      };
    },
  },
});
