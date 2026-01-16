import { Book, BookOpen, Star, Video } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { knowledgeHubSchema } from "@/schemas/documents/knowledge-hub/knowledge-hub.schema";
import { knowledgeArticleArchiveSchema } from "@/schemas/documents/knowledge-hub/knowledge-article-archive.schema";
import { caseStudyArchiveSchema } from "@/schemas/documents/knowledge-hub/case-study-archive.schema";
import { seminarArchiveSchema } from "@/schemas/documents/knowledge-hub/seminar-archive.schema";
import { eBookArchiveSchema } from "@/schemas/documents/knowledge-hub/e-book-archive.schema";

const title = "Knowledge hub";

export const knowledgeHubStructure = (S: StructureBuilder) => {
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
                  S.documentTypeListItem("knowledgeArticle").title("Knowledge articles"),
                  S.divider(),
                  singletonListItem(S, knowledgeArticleArchiveSchema),
                ]),
            ),

          S.listItem()
            .title("Case studies")
            .icon(Star)
            .child(
              S.list()
                .title("Case studies")
                .items([
                  S.documentTypeListItem("caseStudy").title("Case studies"),
                  S.divider(),
                  singletonListItem(S, caseStudyArchiveSchema),
                ]),
            ),

          S.listItem()
            .title("Seminars")
            .icon(Video)
            .child(
              S.list()
                .title("Seminars")
                .items([
                  S.documentTypeListItem("seminar").title("Seminars"),
                  S.divider(),
                  singletonListItem(S, seminarArchiveSchema),
                ]),
            ),

          S.listItem()
            .title("E-books")
            .icon(BookOpen)
            .child(
              S.list()
                .title("E-books")
                .items([
                  S.documentTypeListItem("eBook").title("E-books"),
                  S.divider(),
                  singletonListItem(S, eBookArchiveSchema),
                ]),
            ),

          S.divider(),

          singletonListItem(S, knowledgeHubSchema),
        ]),
    );
};
