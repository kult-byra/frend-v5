import { Building2 } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { organisationSettingsSchema } from "@/schemas/documents/organisation/organisation-settings.schema";

const title = "Organisation";

export const organisationStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title(title)
    .icon(Building2)
    .child(
      S.list()
        .title(title)
        .items([
          S.documentTypeListItem("jobOpening").title("Job openings"),
          S.divider(),
          singletonListItem(S, organisationSettingsSchema),
        ]),
    );
};
