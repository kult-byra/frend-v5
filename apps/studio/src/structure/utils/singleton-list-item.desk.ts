import type { DocumentDefinition } from "sanity";

import type { StructureBuilder } from "sanity/structure";

/**
 * Creates a singleton list item for a document.
 *
 * For document-level i18n types (when languageId and i18nSchemaTypes are provided),
 * uses language-suffixed document IDs (e.g., "servicesArchive-no").
 *
 * For field-level i18n types (settings), uses the schema type name as the document ID.
 */
export const singletonListItem = (
  S: StructureBuilder,
  schema: DocumentDefinition,
  languageId?: string,
  i18nSchemaTypes?: string[],
) => {
  // For document-level i18n types, use language-suffixed document IDs
  const isDocumentLevelI18n = languageId && i18nSchemaTypes?.includes(schema.name);
  const documentId = isDocumentLevelI18n ? `${schema.name}-${languageId}` : schema.name;

  return S.listItem()
    .title(schema.title ?? schema.name)
    .icon(schema.icon)
    .child(S.document().schemaType(schema.name).documentId(documentId));
};
