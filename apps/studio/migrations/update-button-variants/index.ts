/**
 * Migration: Update legacy button variants to new semantic names
 *
 * This migration updates button variants in link objects:
 *
 * Old values:
 * - "default" -> "primary"
 * - "outline" -> "secondary"
 *
 * New values:
 * - "primary" (filled button)
 * - "secondary" (outline button)
 *
 * Usage:
 *   cd apps/studio
 *   npx sanity migration run update-button-variants --dry
 *   npx sanity migration run update-button-variants
 */

import { defineMigration, set } from "sanity/migrate";

export default defineMigration({
  title: "Update legacy button variants to new semantic names",

  migrate: {
    object(node, path) {
      // Skip internal Sanity fields
      const pathString = path.map((p) => (typeof p === "string" ? p : `[${p}]`)).join(".");
      if (pathString.startsWith("_")) return;

      // Check if this object has a buttonVariant field with legacy values
      const hasButtonVariant = "buttonVariant" in node;
      if (!hasButtonVariant) return;

      const { buttonVariant } = node as { buttonVariant: string };

      // Map legacy values to new semantic names
      if (buttonVariant === "default") {
        return set({ ...node, buttonVariant: "primary" });
      }

      if (buttonVariant === "outline") {
        return set({ ...node, buttonVariant: "secondary" });
      }

      // No changes needed for other values
      return;
    },
  },
});
