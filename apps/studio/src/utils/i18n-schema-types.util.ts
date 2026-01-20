/**
 * Document types that support internationalization.
 * Used by:
 * - sanity.config.ts (document-internationalization plugin)
 * - initial-value-templates (filter base templates)
 * - i18n-preview.util.ts (enhance previews)
 * - missing-language-input.tsx (show banner)
 * - missing-language-badge.tsx (show badge)
 */
export const I18N_SCHEMA_TYPES = [
  "page",
  "frontPage",
  "conversionPage",
  "newsArticle",
  "event",
  "newsAndEventsArchive",
  "knowledgeArticle",
  "knowledgeHub",
  "knowledgeArticleArchive",
  "service",
  "subService",
  "servicesArchive",
  "seminar",
  "seminarArchive",
  "caseStudy",
  "caseStudyArchive",
  "eBook",
  "eBookArchive",
  "client",
  "clientArchive",
  "jobOpening",
  // Settings use field-level translations (language fieldsets) instead of document-level i18n
] as const;

export type I18nSchemaType = (typeof I18N_SCHEMA_TYPES)[number];
