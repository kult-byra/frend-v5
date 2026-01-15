import { Building } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { clientArchiveSchema } from "@/schemas/documents/clients/client-archive.schema";

const title = "Clients";

export const clientsStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title(title)
    .icon(Building)
    .child(
      S.list()
        .title(title)
        .items([
          S.documentTypeListItem("client").title("Clients"),

          S.divider(),

          singletonListItem(S, clientArchiveSchema),
        ]),
    );
};
