/**
 * Migration: Add missing language fields to i18n documents
 *
 * This migration adds the `language` field to internationalized documents that are missing it.
 * Documents are categorized by detected content language:
 * - Norwegian: "Et sted å vokse" (careers page)
 * - English: about-us page, 2 events, 1 eBook, 1 conversion page
 *
 * Usage:
 *   npx sanity migration run add-missing-language-fields --dry  # Preview changes
 *   npx sanity migration run add-missing-language-fields        # Execute migration
 */

import { at, defineMigration, set } from "sanity/migrate";

// Norwegian content detected
const NORWEGIAN_DOCS = ["14c6ef3d-ff20-48a9-a5be-a515999c536e"];

// English content detected
const ENGLISH_DOCS = [
  "5060810e-e3ba-4bc5-a5d7-dfd905f2e850", // page: "We believe technology..."
  "35d5487b-179a-474e-96c2-f273e1f58efa", // event: "Discover what's possible with Intapp"
  "6f1601ff-62cf-421e-b927-0d664f342004", // event: "Frends AI Event"
  "77e51903-7ff4-4ca7-9a9a-bdcc8163919c", // eBook: "Presentation: Best practices..."
  "e57a8ff7-fd8d-4ce6-9950-ed4c673d4d49", // conversionPage: "Discover how we can improve..."
];

export default defineMigration({
  title: "Add missing language fields to i18n documents",
  documentTypes: ["page", "event", "eBook", "conversionPage"],
  migrate: {
    document(doc, context) {
      // Skip documents that already have a language field
      if (doc.language) {
        return undefined;
      }

      // Set Norwegian language
      if (NORWEGIAN_DOCS.includes(doc._id)) {
        return [at("language", set("no"))];
      }

      // Set English language
      if (ENGLISH_DOCS.includes(doc._id)) {
        return [at("language", set("en"))];
      }

      // No changes needed for other documents
      return undefined;
    },
  },
});
