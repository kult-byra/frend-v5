import { BookOpen } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { knowledgeHubSchema } from "@/schemas/documents/knowledge-hub/knowledge-hub.schema";

const title = "Knowledge hub";

export const knowledgeHubStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title(title)
    .icon(BookOpen)
    .child(
      S.list()
        .title(title)
        .items([
          S.documentTypeListItem("knowledgeArticle").title("Knowledge articles"),
          S.documentTypeListItem("caseStudy").title("Case studies"),
          S.documentTypeListItem("seminar").title("Seminars"),
          S.documentTypeListItem("eBook").title("E-books"),

          S.divider(),

          singletonListItem(S, knowledgeHubSchema),
        ]),
    );
};
