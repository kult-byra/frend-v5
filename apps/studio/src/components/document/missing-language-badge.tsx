import type { DocumentBadgeComponent } from "sanity";

/**
 * Badge component that displays a warning when a document has no language set.
 * Use this with i18n document types to alert editors about orphan documents.
 */
export const MissingLanguageBadge: DocumentBadgeComponent = (props) => {
  const { draft, published } = props;
  const doc = draft || published;

  if (!doc || doc.language) {
    return null;
  }

  return {
    label: "No language",
    title: "This document has no language set. Please select a language.",
    color: "danger",
  };
};
