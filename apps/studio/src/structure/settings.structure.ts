import { Settings } from "lucide-react";

import type { StructureBuilder } from "sanity/structure";

import { hubspotFormSchema } from "@/schemas/documents/hubspot-form.schema";
import { menuSettingsSchema, metadataSettingsSchema, siteSettingsSchema } from "@/schemas/settings";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";

export const settingsStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title("Settings")
    .icon(Settings)
    .child(
      S.list()
        .title("Settings")
        .items([
          singletonListItem(S, siteSettingsSchema),

          singletonListItem(S, menuSettingsSchema),

          S.divider(),

          singletonListItem(S, metadataSettingsSchema),

          S.divider(),

          S.listItem()
            .title(hubspotFormSchema.title ?? "HubSpot forms")
            .icon(hubspotFormSchema.icon)
            .child(
              S.documentTypeList(hubspotFormSchema.name).title(
                hubspotFormSchema.title ?? "HubSpot forms",
              ),
            ),
        ]),
    );
};
