import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { articlesStructure } from "@/structure/articles.structure";
import { settingsStructure } from "@/structure/settings.structure";
import { servicesStructure } from "@/structure/services.structure";
import { knowledgeHubStructure } from "./knowledge-hub.structure";
import { clientsStructure } from "./clients.structure";
import { organisationStructure } from "./organisation.structure";

/**
 * Creates a filtered document list item that only shows documents for a specific language.
 * For i18n document types, filters by the `language` field.
 * Documents without a language set (orphans) will appear in both language views.
 * For non-i18n types, shows all documents.
 */
export const filteredDocumentListItem = (
  S: StructureBuilder,
  typeName: string,
  title: string,
  languageId?: string,
  i18nSchemaTypes?: string[]
) => {
  // If this type supports i18n and we have a language filter, filter by language
  // Also include documents without a language set (orphans) so they appear in both views
  if (languageId && i18nSchemaTypes?.includes(typeName)) {
    return S.listItem()
      .title(title)
      .schemaType(typeName)
      .child(
        S.documentList()
          .title(title)
          .schemaType(typeName)
          .filter('_type == $type && (language == $language || !defined(language))')
          .params({ type: typeName, language: languageId })
      );
  }
  // Otherwise, show all documents of this type
  return S.documentTypeListItem(typeName).title(title);
};

/**
 * Creates a structure resolver that filters content by language.
 * Documents with i18n support will only show content for the specified language.
 */
export const createLanguageStructure = (
  languageId: string,
  i18nSchemaTypes: string[]
): StructureResolver => {
  return (S) =>
    S.list()
      .title("Content")
      .items([
        settingsStructure(S, languageId, i18nSchemaTypes),

        S.divider(),

        filteredDocumentListItem(S, "frontPage", "Front page", languageId, i18nSchemaTypes),
        filteredDocumentListItem(S, "page", "Pages", languageId, i18nSchemaTypes),
        filteredDocumentListItem(S, "conversionPage", "Conversion pages", languageId, i18nSchemaTypes),

        S.divider(),

        articlesStructure(S, languageId, i18nSchemaTypes),

        knowledgeHubStructure(S, languageId, i18nSchemaTypes),

        S.divider(),

        servicesStructure(S, languageId, i18nSchemaTypes),

        clientsStructure(S, languageId, i18nSchemaTypes),

        S.divider(),

        organisationStructure(S, languageId, i18nSchemaTypes),
      ]);
};

// Keep original structure for backwards compatibility
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      settingsStructure(S),

      S.divider(),

      S.documentTypeListItem("frontPage").title("Front page"),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("conversionPage").title("Conversion pages"),

      S.divider(),

      articlesStructure(S),

      knowledgeHubStructure(S),

      S.divider(),

      servicesStructure(S),

      clientsStructure(S),

      S.divider(),

      organisationStructure(S),
    ]);
