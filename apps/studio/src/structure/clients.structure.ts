import { Building } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { clientArchiveSchema } from "@/schemas/documents/clients/client-archive.schema";
import { filteredDocumentListItem } from "@/structure/structure";

const title = "Clients";

export const clientsStructure = (
  S: StructureBuilder,
  languageId?: string,
  i18nSchemaTypes?: string[]
) => {
  return S.listItem()
    .title(title)
    .icon(Building)
    .child(
      S.list()
        .title(title)
        .items([
          filteredDocumentListItem(S, "client", "Clients", languageId, i18nSchemaTypes),

          S.divider(),

          singletonListItem(S, clientArchiveSchema, languageId, i18nSchemaTypes),
        ]),
    );
};
