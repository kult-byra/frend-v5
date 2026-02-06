import type { ReactNode } from "react";
import { defineField, type FieldDefinition, type ObjectDefinition } from "sanity";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export type HeroType = "mediaHero" | "articleHero" | "stickyHero";

/**
 * Options for articleHeroField generator
 */
export type ArticleHeroFieldOptions = {
  name?: string;
  title?: string;
  group?: string;
  /** Include subheading field (default: false) */
  useSubheading?: boolean;
  /** Include excerpt field (default: false) */
  useExcerpt?: boolean;
  /** Include byline (author + date) fields (default: false) */
  useByline?: boolean;
  /** Include media field. Number sets max items (default: false, set to 1 or 2 to enable) */
  useMedia?: number | false;
};

/**
 * Creates an article hero field with configurable optional fields.
 * Only title is always included. All other fields must be explicitly enabled.
 *
 * Labels are handled in the frontend by resolving from document _type via string translations.
 * Pass showLabel prop to ArticleHero component to enable.
 *
 * @example Minimal (title only)
 * ```ts
 * articleHeroField({ group: "key" })
 * ```
 *
 * @example News article (with byline, excerpt, and 2 images)
 * ```ts
 * articleHeroField({
 *   group: "key",
 *   useByline: true,
 *   useExcerpt: true,
 *   useMedia: 2,
 * })
 * ```
 *
 * @example Case study (with media only)
 * ```ts
 * articleHeroField({
 *   group: "key",
 *   useMedia: 1,
 * })
 * ```
 */
export const articleHeroField = (options: ArticleHeroFieldOptions = {}) => {
  const {
    name = "hero",
    title = "Hero",
    group,
    useSubheading = false,
    useExcerpt = false,
    useByline = false,
    useMedia = false,
  } = options;

  const fields: FieldDefinition[] = [
    // Title is always required
    stringField({
      name: "title",
      title: "Title",
      description: "The article headline",
      required: true,
    }),
  ];

  // Subheading
  if (useSubheading) {
    fields.push(
      stringField({
        name: "subheading",
        title: "Subheading",
        description: "Text displayed below the title",
      }),
    );
  }

  // Excerpt
  if (useExcerpt) {
    fields.push(
      portableTextField({
        name: "excerpt",
        title: "Excerpt",
        description: "A brief summary of the article",
        noContent: true,
        includeLists: true,
      }),
    );
  }

  // Byline (author + date)
  if (useByline) {
    fields.push(
      defineField({
        name: "byline",
        title: "Byline",
        description: "Author and publication date",
        type: "byline",
      }),
    );
  }

  // Media
  if (useMedia) {
    const maxItems = typeof useMedia === "number" ? useMedia : 1;
    fields.push(
      defineField({
        name: "media",
        title: "Cover media",
        description:
          maxItems > 1 ? `Cover images or video (max ${maxItems})` : "Cover image or video",
        type: "array",
        of: [mediaField({ name: "mediaItem", video: true, aspectRatio: false })],
        validation: (Rule) => Rule.max(maxItems),
      }),
    );
  }

  return defineField({
    name,
    title,
    type: "object",
    group,
    fields,
    options: {
      collapsible: true,
      collapsed: false,
    },
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
};

export type HeroFieldOptions = Omit<FieldDef<ObjectDefinition>, "fields"> & {
  /** Hero types to allow (required) */
  types: HeroType[];
};

const HERO_TYPE_LABELS: Record<HeroType, string> = {
  mediaHero: "Media",
  articleHero: "Article",
  stickyHero: "Sticky",
};

type HeroTypeOption = {
  title: string;
  value: HeroType;
};

const buildHeroTypeOptions = (types: HeroType[]): HeroTypeOption[] => {
  return types.map((type) => ({
    title: HERO_TYPE_LABELS[type],
    value: type,
  }));
};

/**
 * Creates a hero field with configurable allowed hero types.
 *
 * @example Single type (hides selector)
 * ```ts
 * heroField({
 *   name: "hero",
 *   types: ["articleHero"],
 *   group: "key",
 * })
 * ```
 *
 * @example Multiple types (shows selector)
 * ```ts
 * heroField({
 *   name: "hero",
 *   types: ["mediaHero", "textHero"],
 *   group: "key",
 * })
 * ```
 */
export const heroField = (props: HeroFieldOptions) => {
  const { name, title = "Hero", types, required, validation, ...rest } = props;

  if (types.length === 0) {
    throw new Error("heroField requires at least one type in the types array");
  }

  const heroTypeOptions = buildHeroTypeOptions(types);
  const initialHeroType = types[0];
  const hasMultipleTypes = types.length > 1;

  // Build validation for the composite field
  const validateHero = (Rule: any) => {
    const rules = [];

    if (required) {
      rules.push(
        Rule.custom((value: any) => {
          const heroType = value?.heroType as HeroType | undefined;
          if (!heroType) {
            return "Please select a hero type";
          }

          const heroData = value?.[heroType];
          if (!heroData?.title) {
            return "Hero title is required";
          }

          return true;
        }),
      );
    }

    return rules;
  };

  // Build fields array based on allowed hero types
  const fields: FieldDefinition[] = [
    defineField({
      name: "heroType",
      title: "Hero type",
      description: hasMultipleTypes ? "Choose the hero presentation style" : undefined,
      type: "string",
      options: {
        list: heroTypeOptions,
        layout: "dropdown",
      },
      initialValue: initialHeroType,
      hidden: !hasMultipleTypes,
      // Only require when multiple types are available; single-type fields treat undefined as default
      validation: hasMultipleTypes ? (Rule) => Rule.required() : undefined,
    }),
  ];

  // Add hero type fields only for allowed types
  // When single type, show it by default even if heroType is undefined (for existing/migrated documents)
  const isDefaultType = (type: HeroType) =>
    !hasMultipleTypes && types[0] === type
      ? ({ parent }: { parent?: { heroType?: string } }) =>
          parent?.heroType != null && parent?.heroType !== type
      : ({ parent }: { parent?: { heroType?: string } }) => parent?.heroType !== type;

  if (types.includes("mediaHero")) {
    fields.push(
      defineField({
        name: "mediaHero",
        title: "Media Hero",
        type: "mediaHero",
        hidden: isDefaultType("mediaHero"),
      }),
    );
  }

  if (types.includes("articleHero")) {
    fields.push(
      defineField({
        name: "articleHero",
        title: "Article Hero",
        type: "articleHero",
        hidden: isDefaultType("articleHero"),
      }),
    );
  }

  if (types.includes("stickyHero")) {
    fields.push(
      defineField({
        name: "stickyHero",
        title: "Sticky Hero",
        type: "stickyHero",
        hidden: isDefaultType("stickyHero"),
      }),
    );
  }

  // Build preview select and prepare based on allowed types
  const previewSelect: Record<string, string> = {
    heroType: "heroType",
  };

  if (types.includes("mediaHero")) {
    previewSelect.mediaHeroTitle = "mediaHero.title";
    previewSelect.mediaHeroMedia = "mediaHero.media.image.asset";
  }
  if (types.includes("articleHero")) {
    previewSelect.articleHeroTitle = "articleHero.title";
    previewSelect.articleHeroMedia = "articleHero.media.0.image.asset";
  }
  if (types.includes("stickyHero")) {
    previewSelect.stickyHeroTitle = "stickyHero.title";
    previewSelect.stickyHeroMedia = "stickyHero.media.image.asset";
  }

  return defineField({
    ...rest,
    name,
    title,
    type: "object",
    fields,
    validation: validation ?? validateHero,
    options: {
      collapsible: true,
      collapsed: false,
    },
    preview: {
      select: previewSelect,
      prepare(selection) {
        const heroType = selection.heroType as HeroType | undefined;

        const titleMap: Record<HeroType, string | undefined> = {
          mediaHero: selection.mediaHeroTitle,
          articleHero: selection.articleHeroTitle,
          stickyHero: selection.stickyHeroTitle,
        };

        const heroTitle = heroType ? titleMap[heroType] : undefined;
        const typeLabel = heroType ? HERO_TYPE_LABELS[heroType] : undefined;

        // Get the appropriate media based on hero type
        let heroMedia: unknown;
        if (heroType === "mediaHero") {
          heroMedia = selection.mediaHeroMedia;
        } else if (heroType === "articleHero") {
          heroMedia = selection.articleHeroMedia;
        } else if (heroType === "stickyHero") {
          heroMedia = selection.stickyHeroMedia;
        }

        return {
          title: heroTitle || "Hero",
          subtitle: typeLabel,
          media: heroMedia as ReactNode,
        };
      },
    },
  });
};
