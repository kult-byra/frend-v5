/**
 * Migration: Refactor image gallery to media gallery
 *
 * This migration:
 * 1. Renames `imageGallery.block` to `mediaGallery.block`
 * 2. Renames the `images` field to `media` within those blocks
 * 3. Removes `imagesAndText.block` blocks (DESTRUCTIVE)
 * 4. Removes `imagesWithBanner.block` blocks (DESTRUCTIVE)
 *
 * Usage:
 *   cd apps/studio
 *   npx sanity migration run media-gallery-refactor --dry
 *   npx sanity migration run media-gallery-refactor
 */

import { defineMigration, set } from "sanity/migrate";

// Block types to remove (content will be lost)
const BLOCKS_TO_REMOVE = ["imagesAndText.block", "imagesWithBanner.block"];

export default defineMigration({
  title: "Refactor image gallery to media gallery",

  migrate: {
    // Handle array items - remove deprecated block types
    array(node, path) {
      if (!Array.isArray(node)) return;

      // Check if any items need to be removed
      const hasBlocksToRemove = node.some(
        (item) =>
          item &&
          typeof item === "object" &&
          "_type" in item &&
          BLOCKS_TO_REMOVE.includes(item._type as string),
      );

      if (!hasBlocksToRemove) return;

      // Filter out deprecated blocks
      const filteredArray = node.filter((item) => {
        if (item && typeof item === "object" && "_type" in item) {
          const type = item._type as string;
          if (BLOCKS_TO_REMOVE.includes(type)) {
            const pathString = path.map((p) => (typeof p === "string" ? p : `[${p}]`)).join(".");
            console.log(`  Removing ${type} block at ${pathString}`);
            return false;
          }
        }
        return true;
      });

      // Only update if we actually removed something
      if (filteredArray.length !== node.length) {
        return set(filteredArray);
      }
    },

    // Handle objects - rename imageGallery.block to mediaGallery.block
    object(node, path) {
      // Skip internal Sanity fields
      const pathString = path.map((p) => (typeof p === "string" ? p : `[${p}]`)).join(".");
      if (pathString.startsWith("_")) return;

      // Check if this is an imageGallery.block
      if (node._type !== "imageGallery.block") return;

      // Build the new object with renamed type and field
      const { images, ...rest } = node as Record<string, unknown>;

      const newNode = {
        ...rest,
        _type: "mediaGallery.block",
        // Rename images to media
        ...(images !== undefined ? { media: images } : {}),
      };

      console.log(`  Converting imageGallery.block to mediaGallery.block at ${pathString}`);

      return set(newNode);
    },
  },
});
