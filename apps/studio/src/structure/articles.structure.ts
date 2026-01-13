import { Newspaper } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { articleArchiveSchema } from "@/schemas/documents";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";

const title = "Artikler";

export const articlesStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title(title)
    .icon(Newspaper)
    .child(
      S.list()
        .title(title)
        .items([
          S.documentTypeListItem("article").title(title),

          S.divider(),

          singletonListItem(S, articleArchiveSchema),
        ]),
    );
};
