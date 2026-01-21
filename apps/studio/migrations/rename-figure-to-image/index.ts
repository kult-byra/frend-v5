/**
 * Migration: Rename figure to image in media fields
 *
 * This migration updates existing content from the old figureOrVideoField structure
 * to the new mediaField structure:
 *
 * Old structure:
 * - mediaType: "figure" | "video"
 * - figure: { asset, crop, hotspot }
 *
 * New structure:
 * - mediaType: "image" | "video"
 * - image: { asset, crop, hotspot }
 *
 * Usage:
 *   cd apps/studio
 *   npx sanity migration run rename-figure-to-image --dry
 *   npx sanity migration run rename-figure-to-image
 */

import { defineMigration, set } from "sanity/migrate";

export default defineMigration({
  title: "Rename figure to image in media fields",

  migrate: {
    // Transform objects that have mediaType: "figure" or figure field
    object(node, path) {
      // Skip internal Sanity fields
      const pathString = path.map((p) => (typeof p === "string" ? p : `[${p}]`)).join(".");
      if (pathString.startsWith("_")) return;

      // Check if this is a media object with the old structure
      const hasOldMediaType = node.mediaType === "figure";
      const hasFigureField = "figure" in node;

      if (!hasOldMediaType && !hasFigureField) return;

      // Build the new object
      const { figure, mediaType, ...rest } = node as Record<string, unknown>;

      const newNode = {
        ...rest,
        mediaType: mediaType === "figure" ? "image" : mediaType,
        ...(hasFigureField ? { image: figure } : {}),
      };

      return set(newNode);
    },
  },
});
