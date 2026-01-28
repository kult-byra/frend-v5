/**
 * Migration: Fix seminar events
 *
 * This migration adds missing schema fields to seminar documents:
 * - isFlagshipModelSeminar (boolean, default false)
 * - services (array reference, default [])
 * - industries (array reference, default [])
 * - technologies (array reference, default [])
 *
 * Usage:
 *   cd apps/studio
 *   npx sanity migration run fix-seminar-events --dry
 *   npx sanity migration run fix-seminar-events
 */

import { at, defineMigration, setIfMissing } from "sanity/migrate";

const SEMINAR_IDS = [
  "095724fa-9253-4eb0-a681-d76face8c49d", // English published version
  "drafts.7025c30b-a221-4631-b683-ca3c20944c9c", // Norwegian draft version
];

export default defineMigration({
  title: "Fix seminar events - add missing schema fields",

  documentTypes: ["seminar"],

  migrate: {
    document(doc, context) {
      // Only process the specific seminar documents we're fixing
      if (!SEMINAR_IDS.includes(doc._id)) {
        return;
      }

      return [
        // Add isFlagshipModelSeminar if missing
        at("isFlagshipModelSeminar", setIfMissing(false)),

        // Add empty connection arrays if missing
        at("services", setIfMissing([])),
        at("industries", setIfMissing([])),
        at("technologies", setIfMissing([])),
      ];
    },
  },
});
