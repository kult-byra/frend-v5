import { FolderOpen, Settings, Tag } from "lucide-react";

import type { StructureBuilder } from "sanity/structure";

import { hubspotFormSchema } from "@/schemas/documents/hubspot-form.schema";
import { isometricIllustrationSchema } from "@/schemas/documents/isometric-illustration.schema";
import { logoSchema } from "@/schemas/documents/logo.schema";
import {
  menuSettingsSchema,
  metadataSettingsSchema,
  newsletterSettingsSchema,
  siteSettingsSchema,
  stringTranslationsSchema,
} from "@/schemas/settings";
import { footerSettingsSchema } from "@/schemas/settings/footer-settings.schema";
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
          S.divider(),
          singletonListItem(S, menuSettingsSchema),
          singletonListItem(S, footerSettingsSchema),
          singletonListItem(S, newsletterSettingsSchema),
          S.divider(),
          singletonListItem(S, metadataSettingsSchema),
          singletonListItem(S, stringTranslationsSchema),
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

          S.divider(),

          S.listItem()
            .title("Resources")
            .icon(FolderOpen)
            .child(
              S.list()
                .title("Resources")
                .items([
                  S.documentTypeListItem(logoSchema.name).title(logoSchema.title ?? "Logos"),
                  S.documentTypeListItem(isometricIllustrationSchema.name).title(
                    isometricIllustrationSchema.title ?? "Isometric illustrations",
                  ),
                ]),
            ),
        ]),
    );
};
