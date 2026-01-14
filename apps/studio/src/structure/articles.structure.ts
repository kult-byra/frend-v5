import { Newspaper } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { newsAndEventsArchiveSchema } from "@/schemas/documents";

const title = "News and events";

export const articlesStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title(title)
    .icon(Newspaper)
    .child(
      S.list()
        .title(title)
        .items([
          S.documentTypeListItem("newsArticle").title("News articles"),

          S.divider(),

          singletonListItem(S, newsAndEventsArchiveSchema),
        ]),
    );
};
