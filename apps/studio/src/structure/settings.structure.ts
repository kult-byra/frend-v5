import { Settings, Tag } from "lucide-react";

import type { StructureBuilder } from "sanity/structure";

import { hubspotFormSchema } from "@/schemas/documents/hubspot-form.schema";
import { menuSettingsSchema, metadataSettingsSchema, siteSettingsSchema, stringTranslationsSchema } from "@/schemas/settings";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { footerSettingsSchema } from "@/schemas/settings/footer-settings.schema";

export const settingsStructure = (
  S: StructureBuilder,
  languageId?: string,
  i18nSchemaTypes?: string[]
) => {
  return S.listItem()
    .title("Settings")
    .icon(Settings)
    .child(
      S.list()
        .title("Settings")
        .items([
          singletonListItem(S, siteSettingsSchema, languageId, i18nSchemaTypes),

          singletonListItem(S, menuSettingsSchema, languageId, i18nSchemaTypes),

          singletonListItem(S, footerSettingsSchema, languageId, i18nSchemaTypes),

          S.divider(),

          singletonListItem(S, metadataSettingsSchema, languageId, i18nSchemaTypes),

          singletonListItem(S, stringTranslationsSchema, languageId, i18nSchemaTypes),

          S.divider(),

          S.listItem()
            .title(hubspotFormSchema.title ?? "HubSpot forms")
            .icon(hubspotFormSchema.icon)
            .child(
              S.documentTypeList(hubspotFormSchema.name).title(
                hubspotFormSchema.title ?? "HubSpot forms",
              ),
            ),

            S.divider(),

            S.documentTypeListItem("quote").title("Quotes"),

            S.divider(),

            S.listItem()
            .title("Tags")
            .icon(Tag)
            .child(
              S.list()
                .title("Tags")
                .items([
                  S.documentTypeListItem("technology").title("Technologies"),
                  S.documentTypeListItem("industry").title("Industries"),
                ]),
            ),
        ]),
    );
};
