import { defineField } from "sanity";
import { LINKABLE_TYPES } from "@/utils/linkable-types.util";

/**
 * Internal link reference field with automatic language filtering.
 *
 * When used inside an i18n document (one with a `language` field),
 * the reference picker will only show documents matching the same language
 * OR documents without a language field (non-i18n types like service).
 *
 * This ensures editors can only link to content in their current language context.
 */
export const internalLinkSchema = defineField({
  name: "internalLink",
  title: "Velg dokument",
  type: "reference",
  to: LINKABLE_TYPES.map((type) => {
    return { type };
  }),
  options: {
    disableNew: true,
    filter: ({ document }) => {
      // Get the language from the parent document
      const language = document?.language;

      // If the parent document has a language, filter references to match
      // Show documents with the same language OR documents without a language field
      if (language) {
        return {
          filter: "language == $language || !defined(language)",
          params: { language },
        };
      }

      // No language set on parent document - show all documents
      return {
        filter: "",
      };
    },
  },
});
