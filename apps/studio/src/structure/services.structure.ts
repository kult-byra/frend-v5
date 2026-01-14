import { Package } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { servicesArchiveSchema } from "@/schemas/documents";

const title = "Services";

export const servicesStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title(title)
    .icon(Package)
    .child(
      S.list()
        .title(title)
        .items([
    S.documentTypeListItem("service").title("Services"),

          S.divider(),

          singletonListItem(S, servicesArchiveSchema),
        ]),
    );
};
