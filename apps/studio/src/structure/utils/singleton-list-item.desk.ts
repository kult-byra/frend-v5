import type { DocumentDefinition } from "sanity";

import type { StructureBuilder } from "sanity/structure";

/**
 * Creates a singleton list item for a document.
 * When languageId is provided and the schema type supports i18n,
 * it will use a language-specific document ID (e.g., "siteSettings-no").
 */
export const singletonListItem = (
  S: StructureBuilder,
  schema: DocumentDefinition,
  languageId?: string,
  i18nSchemaTypes?: string[]
) => {
  // Determine the document ID - use language suffix for i18n types
  const documentId =
    languageId && i18nSchemaTypes?.includes(schema.name)
      ? `${schema.name}-${languageId}`
      : schema.name;

  return S.listItem()
    .title(schema.title ?? schema.name)
    .icon(schema.icon)
    .child(S.document().schemaType(schema.name).documentId(documentId));
};
