import { Building2 } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { organisationSettingsSchema } from "@/schemas/documents/organisation/organisation-settings.schema";
import { filteredDocumentListItem } from "@/structure/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";

const title = "Organisation";

export const organisationStructure = (
  S: StructureBuilder,
  languageId?: string,
  i18nSchemaTypes?: string[],
) => {
  return S.listItem()
    .title(title)
    .icon(Building2)
    .child(
      S.list()
        .title(title)
        .items([
          S.documentTypeListItem("person").title("People"),
          filteredDocumentListItem(S, "jobOpening", "Job openings", languageId, i18nSchemaTypes),
          S.divider(),
          singletonListItem(S, organisationSettingsSchema),
        ]),
    );
};
