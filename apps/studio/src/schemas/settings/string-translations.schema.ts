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
    defineField({
      name: "all_no",
      title: "All",
      description: "Label for 'All' filter option",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "filtersAndSort_no",
      title: "Filters & Sort",
      description: "Label for filters and sort button",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "caseStudies_no",
      title: "Case Studies",
      description: "Label for case studies content type",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "articlesAndInsights_no",
      title: "Articles & Insights",
      description: "Label for articles content type",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "seminars_no",
      title: "Seminars",
      description: "Label for seminars content type",
      type: "string",
      group: "no",
    }),
    defineField({
      name: "ebooks_no",
      title: "E-books",
      description: "Label for e-books content type",
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
    defineField({
      name: "all_en",
      title: "All",
      description: "Label for 'All' filter option",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "filtersAndSort_en",
      title: "Filters & Sort",
      description: "Label for filters and sort button",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "caseStudies_en",
      title: "Case Studies",
      description: "Label for case studies content type",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "articlesAndInsights_en",
      title: "Articles & Insights",
      description: "Label for articles content type",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "seminars_en",
      title: "Seminars",
      description: "Label for seminars content type",
      type: "string",
      group: "en",
    }),
    defineField({
      name: "ebooks_en",
      title: "E-books",
      description: "Label for e-books content type",
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
