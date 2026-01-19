import { Languages } from "lucide-react";
import { defineField, defineType } from "sanity";

export const stringTranslationsSchema = defineType({
  type: "document",
  title: "String translations",
  name: "stringTranslations",
  icon: Languages,
  options: {
    singleton: true,
  },
  fieldsets: [
    {
      name: "common",
      title: "Common",
      description: "Common strings used across the site",
    },
    {
      name: "nav",
      title: "Navigation",
      description: "Navigation labels",
    },
  ],
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),

    // Common strings
    defineField({
      name: "skipToMain",
      title: "Skip to main content",
      description: "Accessibility link to skip navigation",
      type: "string",
      fieldset: "common",
    }),
    defineField({
      name: "languageLabel",
      title: "Language",
      description: "Label for language selector",
      type: "string",
      fieldset: "common",
    }),
    defineField({
      name: "notFound",
      title: "Not found",
      description: "404 page title",
      type: "string",
      fieldset: "common",
    }),

    // Navigation strings
    defineField({
      name: "navHome",
      title: "Home",
      type: "string",
      fieldset: "nav",
    }),
    defineField({
      name: "navArticles",
      title: "Articles",
      type: "string",
      fieldset: "nav",
    }),
    defineField({
      name: "navServices",
      title: "Services",
      type: "string",
      fieldset: "nav",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "String translations",
      };
    },
  },
});
