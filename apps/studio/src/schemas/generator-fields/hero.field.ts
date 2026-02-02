import type { ReactNode } from "react";
import { defineField, type FieldDefinition, type ObjectDefinition } from "sanity";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export type HeroType = "textHero" | "mediaHero" | "articleHero" | "formHero";

export type HeroFieldOptions = Omit<FieldDef<ObjectDefinition>, "fields"> & {
  /** Hero types to allow (required) */
  types: HeroType[];
};

const HERO_TYPE_LABELS: Record<HeroType, string> = {
  textHero: "Text",
  mediaHero: "Media",
  articleHero: "Article",
  formHero: "Form",
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
        layout: "radio",
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

  if (types.includes("textHero")) {
    fields.push(
      defineField({
        name: "textHero",
        title: "Text Hero",
        type: "textHero",
        hidden: isDefaultType("textHero"),
      }),
    );
  }

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

  if (types.includes("formHero")) {
    fields.push(
      defineField({
        name: "formHero",
        title: "Form Hero",
        type: "formHero",
        hidden: isDefaultType("formHero"),
      }),
    );
  }

  // Build preview select and prepare based on allowed types
  const previewSelect: Record<string, string> = {
    heroType: "heroType",
  };

  if (types.includes("textHero")) {
    previewSelect.textHeroTitle = "textHero.title";
  }
  if (types.includes("mediaHero")) {
    previewSelect.mediaHeroTitle = "mediaHero.title";
    previewSelect.mediaHeroMedia = "mediaHero.media.image.asset";
  }
  if (types.includes("articleHero")) {
    previewSelect.articleHeroTitle = "articleHero.title";
    previewSelect.articleHeroMedia = "articleHero.media.image.asset";
  }
  if (types.includes("formHero")) {
    previewSelect.formHeroTitle = "formHero.title";
    previewSelect.formHeroMedia = "formHero.media.image.asset";
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
          textHero: selection.textHeroTitle,
          mediaHero: selection.mediaHeroTitle,
          articleHero: selection.articleHeroTitle,
          formHero: selection.formHeroTitle,
        };

        const heroTitle = heroType ? titleMap[heroType] : undefined;
        const typeLabel = heroType ? HERO_TYPE_LABELS[heroType] : undefined;

        // Get the appropriate media based on hero type
        let heroMedia: unknown;
        if (heroType === "mediaHero") {
          heroMedia = selection.mediaHeroMedia;
        } else if (heroType === "articleHero") {
          heroMedia = selection.articleHeroMedia;
        } else if (heroType === "formHero") {
          heroMedia = selection.formHeroMedia;
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
