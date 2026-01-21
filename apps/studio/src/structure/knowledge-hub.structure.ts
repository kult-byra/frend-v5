import { Book, BookOpen, Star, Video } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { caseStudyArchiveSchema } from "@/schemas/documents/knowledge-hub/case-study-archive.schema";
import { eBookArchiveSchema } from "@/schemas/documents/knowledge-hub/e-book-archive.schema";
import { knowledgeArticleArchiveSchema } from "@/schemas/documents/knowledge-hub/knowledge-article-archive.schema";
import { knowledgeHubSchema } from "@/schemas/documents/knowledge-hub/knowledge-hub.schema";
import { seminarArchiveSchema } from "@/schemas/documents/knowledge-hub/seminar-archive.schema";
import { filteredDocumentListItem } from "@/structure/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";

const title = "Knowledge hub";

export const knowledgeHubStructure = (
  S: StructureBuilder,
  languageId?: string,
  i18nSchemaTypes?: string[],
) => {
  return S.listItem()
    .title(title)
    .icon(BookOpen)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .title("Knowledge articles")
            .icon(Book)
            .child(
              S.list()
                .title("Knowledge articles")
                .items([
                  filteredDocumentListItem(
                    S,
                    "knowledgeArticle",
                    "Knowledge articles",
                    languageId,
                    i18nSchemaTypes,
                  ),
                  S.divider(),
                  singletonListItem(S, knowledgeArticleArchiveSchema, languageId, i18nSchemaTypes),
                ]),
            ),

          S.listItem()
            .title("Case studies")
            .icon(Star)
            .child(
              S.list()
                .title("Case studies")
                .items([
                  filteredDocumentListItem(
                    S,
                    "caseStudy",
                    "Case studies",
                    languageId,
                    i18nSchemaTypes,
                  ),
                  S.divider(),
                  singletonListItem(S, caseStudyArchiveSchema, languageId, i18nSchemaTypes),
                ]),
            ),

          S.listItem()
            .title("Seminars")
            .icon(Video)
            .child(
              S.list()
                .title("Seminars")
                .items([
                  filteredDocumentListItem(S, "seminar", "Seminars", languageId, i18nSchemaTypes),
                  S.divider(),
                  singletonListItem(S, seminarArchiveSchema, languageId, i18nSchemaTypes),
                ]),
            ),

          S.listItem()
            .title("E-books")
            .icon(BookOpen)
            .child(
              S.list()
                .title("E-books")
                .items([
                  filteredDocumentListItem(S, "eBook", "E-books", languageId, i18nSchemaTypes),
                  S.divider(),
                  singletonListItem(S, eBookArchiveSchema, languageId, i18nSchemaTypes),
                ]),
            ),

          S.divider(),

          singletonListItem(S, knowledgeHubSchema, languageId, i18nSchemaTypes),
        ]),
    );
};
