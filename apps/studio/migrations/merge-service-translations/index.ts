/**
 * Migration: Merge service and subService language documents into single documents
 *
 * This migration converts service and subService from document-level i18n
 * (separate documents per language) to field-level translations
 * (single document with language-suffixed fields).
 *
 * Before:
 * - service (language: "no"): { title, slug, excerpt, content, ... }
 * - service (language: "en"): { title, slug, excerpt, content, ... }
 * - translation.metadata: { _type: "translation.metadata", translations: [...] }
 *
 * After:
 * - service: { title_no, title_en, slug_no, slug_en, excerpt_no, excerpt_en, content_no, content_en, ... }
 *
 * Strategy:
 * 1. Find all translation.metadata documents for service/subService
 * 2. Build a map of Norwegian doc ID -> English doc ID
 * 3. Find all Norwegian service/subService documents (the "base" documents)
 * 4. Merge fields from both into the Norwegian document with language suffixes
 * 5. Mark English documents as disabled (delete manually after)
 * 6. Mark translation.metadata documents as disabled
 *
 * After running this migration:
 *   1. Verify the merged documents look correct
 *   2. Delete disabled documents manually or via GROQ:
 *      sanity documents delete $(sanity documents query '*[_disabled == true]._id')
 *
 * Usage:
 *   cd apps/studio
 *   npx sanity migration run merge-service-translations --dry
 *   npx sanity migration run merge-service-translations
 */

import { at, defineMigration, patch, setIfMissing, unset } from "sanity/migrate";

interface TranslationValue {
  _key?: string;
  _ref?: string;
  _type?: string;
  value?: {
    _ref?: string;
    _type?: string;
  };
}

interface TranslationMetadata {
  _id: string;
  _type: "translation.metadata";
  translations?: TranslationValue[];
}

interface ServiceDocument {
  _id: string;
  _type: "service" | "subService";
  language?: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: unknown[];
  subServicesDescription?: unknown[];
  content?: unknown[];
  metadata?: Record<string, unknown>;
  media?: Record<string, unknown>;
  industries?: unknown[];
  technologies?: unknown[];
  service?: { _ref?: string }; // For subService parent reference
}

type AnyDocument = TranslationMetadata | ServiceDocument | { _id: string; _type: string };

export default defineMigration({
  title: "Merge service and subService translations into single documents",

  async *migrate(documents) {
    // Collect all documents first to enable lookups
    const serviceAndSubServiceDocs = new Map<string, ServiceDocument>();
    const translationMetadataDocs: TranslationMetadata[] = [];

    // First pass: collect all relevant documents
    for await (const doc of documents()) {
      const typedDoc = doc as AnyDocument;

      if (typedDoc._type === "service" || typedDoc._type === "subService") {
        serviceAndSubServiceDocs.set(typedDoc._id, typedDoc as ServiceDocument);
      } else if (typedDoc._type === "translation.metadata") {
        translationMetadataDocs.push(typedDoc as TranslationMetadata);
      }
    }

    // Build translation mappings from translation.metadata documents
    // Map: Norwegian doc ID -> English doc ID
    const noToEnMap = new Map<string, string>();
    // Map: Any doc ID -> translation.metadata doc ID (for cleanup)
    const docToMetadataMap = new Map<string, string>();

    for (const metaDoc of translationMetadataDocs) {
      if (!metaDoc.translations || !Array.isArray(metaDoc.translations)) continue;

      let noDocId: string | undefined;
      let enDocId: string | undefined;

      for (const trans of metaDoc.translations) {
        const refId = trans._ref || trans.value?._ref;
        if (!refId) continue;

        const referencedDoc = serviceAndSubServiceDocs.get(refId);
        if (!referencedDoc) continue;

        // Track this doc is part of a translation set
        docToMetadataMap.set(refId, metaDoc._id);

        if (referencedDoc.language === "no") {
          noDocId = refId;
        } else if (referencedDoc.language === "en") {
          enDocId = refId;
        }
      }

      if (noDocId && enDocId) {
        noToEnMap.set(noDocId, enDocId);
      }
    }

    // Process Norwegian documents
    const processedEnglishDocs = new Set<string>();
    const processedMetadataDocs = new Set<string>();

    for (const [docId, noDoc] of serviceAndSubServiceDocs) {
      // Skip English documents (they'll be handled via their Norwegian pair)
      if (noDoc.language === "en") continue;

      // Skip if not Norwegian (shouldn't happen, but be safe)
      if (noDoc.language !== "no") continue;

      // Find the English translation
      const enDocId = noToEnMap.get(docId);
      const enDoc = enDocId ? serviceAndSubServiceDocs.get(enDocId) : undefined;

      // Patch the Norwegian document with language-suffixed fields
      yield patch(noDoc._id, [
        // Set Norwegian fields from existing data
        at("title_no", setIfMissing(noDoc.title)),
        at("slug_no", setIfMissing(noDoc.slug)),
        at("excerpt_no", setIfMissing(noDoc.excerpt)),
        at("content_no", setIfMissing(noDoc.content)),
        at("metadata_no", setIfMissing(noDoc.metadata)),

        // Set subServicesDescription_no for services
        ...(noDoc._type === "service" && noDoc.subServicesDescription
          ? [at("subServicesDescription_no", setIfMissing(noDoc.subServicesDescription))]
          : []),

        // Set English fields from translation (if exists)
        ...(enDoc
          ? [
              at("title_en", setIfMissing(enDoc.title)),
              at("slug_en", setIfMissing(enDoc.slug)),
              at("excerpt_en", setIfMissing(enDoc.excerpt)),
              at("content_en", setIfMissing(enDoc.content)),
              at("metadata_en", setIfMissing(enDoc.metadata)),
              ...(enDoc._type === "service" && enDoc.subServicesDescription
                ? [at("subServicesDescription_en", setIfMissing(enDoc.subServicesDescription))]
                : []),
            ]
          : []),

        // Remove old fields
        at("title", unset()),
        at("slug", unset()),
        at("excerpt", unset()),
        at("content", unset()),
        at("metadata", unset()),
        at("subServicesDescription", unset()),
        at("language", unset()),
      ]);

      // Mark English document for deletion (if exists)
      if (enDocId && !processedEnglishDocs.has(enDocId)) {
        processedEnglishDocs.add(enDocId);

        yield patch(enDocId, [
          at("_disabled", setIfMissing(true)),
          at("_disabledReason", setIfMissing(`Merged into Norwegian document: ${noDoc._id}`)),
        ]);
      }

      // Mark translation.metadata document for deletion
      const metadataDocId = docToMetadataMap.get(docId);
      if (metadataDocId && !processedMetadataDocs.has(metadataDocId)) {
        processedMetadataDocs.add(metadataDocId);

        yield patch(metadataDocId, [
          at("_disabled", setIfMissing(true)),
          at("_disabledReason", setIfMissing("Service translations merged to field-level")),
        ]);
      }
    }
  },
});
