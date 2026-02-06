import { defineMigration } from "sanity/migrate";

/**
 * Migration: Case Study PageBuilder to Content
 *
 * This migration identifies caseStudy documents that have pageBuilder content
 * which needs to be manually migrated to the new `content` (Portable Text) field.
 *
 * Page Builder blocks cannot be automatically converted to Portable Text without
 * potential data loss, so this migration only reports documents that need attention.
 *
 * Run with: npx sanity@latest migration run case-study-content --dry
 */

interface CaseStudyDocument {
  _id: string;
  _type: string;
  hero?: {
    articleHero?: {
      title?: string;
    };
    title?: string;
  };
  pageBuilder?: unknown[];
  content?: unknown[];
}

export default defineMigration({
  title: "Report case studies with pageBuilder content for manual migration",
  documentTypes: ["caseStudy"],

  migrate: {
    document(doc) {
      const caseStudy = doc as unknown as CaseStudyDocument;

      const title = caseStudy.hero?.articleHero?.title || caseStudy.hero?.title || caseStudy._id;

      // Check if document has pageBuilder content
      if (caseStudy.pageBuilder && caseStudy.pageBuilder.length > 0) {
        const blockCount = caseStudy.pageBuilder.length;
        const blockTypes = caseStudy.pageBuilder
          .map((block: { _type?: string }) => block._type)
          .filter(Boolean)
          .join(", ");

        console.log(`
MANUAL MIGRATION NEEDED:
  Document: caseStudy "${title}"
  ID: ${caseStudy._id}
  PageBuilder blocks: ${blockCount}
  Block types: ${blockTypes}

  Action: Review this document in Sanity Studio and manually migrate
  content from pageBuilder to the new 'content' portable text field.
`);
      }

      // Check if document already has content
      if (caseStudy.content && caseStudy.content.length > 0) {
        console.log(`OK: caseStudy "${title}" already has content field`);
      }

      // This migration doesn't make changes, only reports
      return [];
    },
  },
});
