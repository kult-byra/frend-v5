/**
 * Migration: Convert service illustration reference to media field
 *
 * This migration converts the old illustration reference structure:
 *   illustration: { _ref: "isometricIllustration-id" }
 *
 * To the new media field structure:
 *   media: { mediaType: "image", image: { asset, crop, hotspot } }
 *
 * The migration resolves the isometricIllustration reference and copies
 * the image data inline.
 *
 * Usage:
 *   cd apps/studio
 *   npx sanity migration run service-illustration-to-media --dry
 *   npx sanity migration run service-illustration-to-media
 */

import { at, defineMigration, set, unset } from "sanity/migrate";

// Cache for resolved illustrations
const illustrationCache = new Map<string, unknown>();

export default defineMigration({
  title: "Convert service illustration reference to media field",
  documentTypes: ["service", "subService"],
  filter: "defined(illustration)",

  migrate: {
    async document(doc, context) {
      const illustrationRef = doc.illustration as { _ref?: string } | undefined;
      if (!illustrationRef?._ref) {
        return undefined;
      }

      // Check cache first
      let image = illustrationCache.get(illustrationRef._ref);

      // Fetch if not cached
      if (!image) {
        const result = await context.client.fetch(
          `*[_id == $ref][0]{ "image": illustration }`,
          { ref: illustrationRef._ref }
        );
        if (result?.image) {
          illustrationCache.set(illustrationRef._ref, result.image);
          image = result.image;
        }
      }

      if (!image) {
        console.log(`Warning: Could not resolve illustration for ${doc._id}`);
        return undefined;
      }

      console.log(`Migrating ${doc._type}: ${doc.title || doc._id}`);

      return [
        at("media", set({ mediaType: "image", image: image })),
        at("illustration", unset()),
      ];
    },
  },
});
