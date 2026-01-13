import { Settings } from "lucide-react";

import type { StructureBuilder } from "sanity/structure";

import { menuSettingsSchema, metadataSettingsSchema, siteSettingsSchema } from "@/schemas/settings";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";

export const settingsStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title("Innstillinger")
    .icon(Settings)
    .child(
      S.list()
        .title("Innstillinger")
        .items([
          singletonListItem(S, siteSettingsSchema),

          singletonListItem(S, menuSettingsSchema),

          S.divider(),

          singletonListItem(S, metadataSettingsSchema),
        ]),
    );
};
