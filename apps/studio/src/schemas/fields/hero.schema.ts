import { LayoutTemplate } from "lucide-react";
import { defineField, defineType } from "sanity";

import { figureOrVideoField } from "@/schemas/generator-fields/figure-or-video-field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";

/**
 * Media and Form Hero
 * A hero type with hero text, media (image/video), and a form reference
 */
export const mediaAndFormHeroSchema = defineType({
  name: "mediaAndFormHero",
  title: "Media and Form Hero",
  type: "object",
  icon: LayoutTemplate,
  fields: [
    stringField({
      name: "heroText",
      title: "Hero text",
      description: "The main heading displayed in the hero section (replaces front page title)",
      required: true,
    }),
    figureOrVideoField({
      name: "media",
      title: "Media",
      required: true,
    }),
    referenceField({
      name: "form",
      title: "Form",
      description: "Select a HubSpot form to display in the hero",
      to: [{ type: "hubspotForm" }],
    }),
  ],
  preview: {
    select: {
      heroText: "heroText",
      media: "media.figure.asset",
    },
    prepare({ heroText, media }) {
      return {
        title: heroText || "Media and Form Hero",
        subtitle: "Media and Form Hero",
        media,
      };
    },
  },
});

/**
 * Hero field for front pages
 * Currently only supports "mediaAndFormHero" type
 */
export const heroSchema = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heroType",
      title: "Hero type",
      type: "string",
      options: {
        list: [{ title: "Media and Form", value: "mediaAndFormHero" }],
        layout: "radio",
      },
      initialValue: "mediaAndFormHero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mediaAndFormHero",
      title: "Media and Form Hero",
      type: "mediaAndFormHero",
      hidden: ({ parent }) => parent?.heroType !== "mediaAndFormHero",
    }),
  ],
  preview: {
    select: {
      heroType: "heroType",
      heroText: "mediaAndFormHero.heroText",
    },
    prepare({ heroType, heroText }) {
      const typeLabels: Record<string, string> = {
        mediaAndFormHero: "Media and Form",
      };
      return {
        title: heroText || "Hero",
        subtitle: typeLabels[heroType] || heroType,
      };
    },
  },
});
