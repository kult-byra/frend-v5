import { Newspaper } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { newsAndEventsArchiveSchema } from "@/schemas/documents";
import { filteredDocumentListItem } from "@/structure/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";

const title = "News and events";

export const articlesStructure = (
  S: StructureBuilder,
  languageId?: string,
  i18nSchemaTypes?: string[],
) => {
  return S.listItem()
    .title(title)
    .icon(Newspaper)
    .child(
      S.list()
        .title(title)
        .items([
          filteredDocumentListItem(S, "newsArticle", "News articles", languageId, i18nSchemaTypes),
          filteredDocumentListItem(S, "event", "Events", languageId, i18nSchemaTypes),

          S.divider(),

          singletonListItem(S, newsAndEventsArchiveSchema, languageId, i18nSchemaTypes),
        ]),
    );
};
