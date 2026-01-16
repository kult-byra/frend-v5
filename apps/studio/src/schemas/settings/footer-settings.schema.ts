import { Bot, PanelBottom } from "lucide-react";
import { defineType } from "sanity";
import { linksField } from "@/schemas/generator-fields/links.field";
import { referenceField } from "../generator-fields/reference.field";
import { pageBuilderField } from "../generator-fields/page-builder.field";
import { defaultGroups } from "../utils/default-groups.util";
import { infoField } from "../generator-fields/info.field";

export const footerSettingsSchema = defineType({
  type: "document",
  name: "footerSettings",
  title: "Footer",
  icon: PanelBottom,
  groups: defaultGroups,
  options: {
    singleton: true,
  },
  fields: [
    linksField({
      name: "footerLinks",
      title: "Footer links",
      includeExternal: true,
      group: "key",
    }),
    referenceField({
        title: "Contact form",
        name: "contactForm",
        to: [{ type: "hubspotForm" }],
        group: "key",
    }),
    pageBuilderField({
        title: "Pre footer",
        description: "Sections displayed before the footer on all pages",
        group: "key",
    }),
    infoField({
        title: "Automatically generated content",
        description: "Contact info, social media links and certifications are displayed automatically, based on the organisation settings.",
        tone: "positive",
        icon: Bot,
        group: ["key"],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Footer",
      };
    },
  },
});
