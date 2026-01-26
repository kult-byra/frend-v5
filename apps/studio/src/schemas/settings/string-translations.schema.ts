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
  fields: [
    // Navigation
    defineField({
      name: "skipToMain",
      title: "Skip to main content",
      description: "Accessibility link to skip navigation",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "languageLabel",
      title: "Language",
      description: "Label for language selector",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "notFound",
      title: "Not found",
      description: "404 page title",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "navHome",
      title: "Home",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "navArticles",
      title: "Articles",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "navServices",
      title: "Services",
      type: "internationalizedArrayString",
    }),

    // Content labels
    defineField({
      name: "featured",
      title: "Featured",
      description: "Label for 'featured' filter option (e.g., client cards)",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "chapters",
      title: "Chapters",
      description: "Label for chapter navigation on service pages",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "all",
      title: "All",
      description: "Label for 'All' filter option",
      type: "internationalizedArrayString",
    }),

    // Knowledge hub filters & sorting
    defineField({
      name: "filtersAndSort",
      title: "Filters & Sort",
      description: "Label for filters and sort button",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "caseStudies",
      title: "Case Studies",
      description: "Label for case studies content type",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "articlesAndInsights",
      title: "Articles & Insights",
      description: "Label for articles content type",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "seminars",
      title: "Seminars",
      description: "Label for seminars content type",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "ebooks",
      title: "E-books",
      description: "Label for e-books content type",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "noResults",
      title: "No results",
      description: "Message shown when filtering returns no items",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "filters",
      title: "Filters",
      description: "Dialog title for filters",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "sorting",
      title: "Sorting",
      description: "Section title for sorting options",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      description: "Section title for technology filters",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "industries",
      title: "Industries",
      description: "Section title for industry filters",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "applyFilters",
      title: "Apply filters",
      description: "Button text to apply filters",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "clearAll",
      title: "Clear all",
      description: "Button text to clear all filters",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "newestFirst",
      title: "Newest first",
      description: "Sorting option for newest first",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "oldestFirst",
      title: "Oldest first",
      description: "Sorting option for oldest first",
      type: "internationalizedArrayString",
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
