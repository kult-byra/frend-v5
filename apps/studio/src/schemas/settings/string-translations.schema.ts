import { Languages } from "lucide-react";
import { defineField, defineType } from "sanity";
import { sharedDocumentInfoField } from "@/schemas/generator-fields/shared-document-info.field";

export const stringTranslationsSchema = defineType({
  type: "document",
  title: "String translations",
  name: "stringTranslations",
  icon: Languages,
  options: {
    singleton: true,
  },
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
  ],
  fields: [
    sharedDocumentInfoField(),

    // Norwegian
    defineField({
      name: "skipToMain_no",
      title: "Skip to main content",
      description: "Accessibility link to skip navigation",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "languageLabel_no",
      title: "Language",
      description: "Label for language selector",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "notFound_no",
      title: "Not found",
      description: "404 page title",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "navHome_no",
      title: "Home",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "navArticles_no",
      title: "Articles",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "navServices_no",
      title: "Services",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "featured_no",
      title: "Featured",
      description: "Label for 'featured' filter option (e.g., client cards)",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "chapters_no",
      title: "Chapters",
      description: "Label for chapter navigation on service pages",
      type: "string",
      group: "no",
    }),

    // English
    defineField({
      name: "skipToMain_en",
      title: "Skip to main content",
      description: "Accessibility link to skip navigation",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "languageLabel_en",
      title: "Language",
      description: "Label for language selector",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "notFound_en",
      title: "Not found",
      description: "404 page title",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "navHome_en",
      title: "Home",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "navArticles_en",
      title: "Articles",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "navServices_en",
      title: "Services",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "featured_en",
      title: "Featured",
      description: "Label for 'featured' filter option (e.g., client cards)",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "chapters_en",
      title: "Chapters",
      description: "Label for chapter navigation on service pages",
      type: "string",
      group: "en",
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
