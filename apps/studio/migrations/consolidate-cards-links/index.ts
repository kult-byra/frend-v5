/**
 * Migration: Consolidate cards block link fields
 *
 * This migration consolidates the separate link fields for different card types
 * into a single `links` field:
 *
 * Old fields:
 * - clientLinks -> links
 * - knowledgeLinks -> links
 * - newsEventLinks -> links
 *
 * Note: The `links` field for services already exists and is unchanged.
 *
 * Usage:
 *   cd apps/studio
 *   npx sanity migration run consolidate-cards-links --dry
 *   npx sanity migration run consolidate-cards-links
 */

import { defineMigration, set, unset } from "sanity/migrate";

export default defineMigration({
  title: "Consolidate cards block link fields into single links field",

  migrate: {
    object(node, path) {
      // Skip internal Sanity fields
      const pathString = path.map((p) => (typeof p === "string" ? p : `[${p}]`)).join(".");
      if (pathString.startsWith("_")) return;

      // Check if this is a cards block with old link fields
      const hasOldLinkField =
        "clientLinks" in node || "knowledgeLinks" in node || "newsEventLinks" in node;
      if (!hasOldLinkField) return;

      const nodeWithLinks = node as {
        links?: unknown;
        clientLinks?: unknown;
        knowledgeLinks?: unknown;
        newsEventLinks?: unknown;
        _type?: string;
      };

      // Only process cards.block objects
      if (nodeWithLinks._type !== "cards.block") return;

      // Determine which old field to use (only one should be present)
      const oldLinkValue =
        nodeWithLinks.clientLinks || nodeWithLinks.knowledgeLinks || nodeWithLinks.newsEventLinks;

      // If links already exists, skip to avoid data loss
      if (nodeWithLinks.links) {
        console.log(
          `Skipping migration: 'links' field already exists at ${pathString}. Please review manually.`,
        );
        return;
      }

      // If no old link value exists, just clean up the old fields
      if (!oldLinkValue) {
        return [unset(["clientLinks"]), unset(["knowledgeLinks"]), unset(["newsEventLinks"])];
      }

      // Rename the old field to links and remove the old fields
      const updatedNode = { ...node };
      delete updatedNode.clientLinks;
      delete updatedNode.knowledgeLinks;
      delete updatedNode.newsEventLinks;

      return set({ ...updatedNode, links: oldLinkValue });
    },
  },
});
