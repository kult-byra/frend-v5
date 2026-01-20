import { Bot, PanelBottom } from "lucide-react";
import { defineType } from "sanity";
import { linksField } from "@/schemas/generator-fields/links.field";
import { figureField } from "../generator-fields/figure.field";
import { infoField } from "../generator-fields/info.field";
import { pageBuilderField } from "../generator-fields/page-builder.field";
import { referenceField } from "../generator-fields/reference.field";

export const footerSettingsSchema = defineType({
  type: "document",
  name: "footerSettings",
  title: "Footer",
  icon: PanelBottom,
  options: {
    singleton: true,
  },
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
    { name: "shared", title: "Shared" },
  ],
  fields: [
    // Norwegian
    linksField({
      name: "footerLinks_no",
      title: "Footer links",
      group: "no",
      includeExternal: true,
    }),
    pageBuilderField({
      name: "pageBuilder_no",
      title: "Pre footer",
      group: "no",
      description: "Sections displayed before the footer on all pages",
    }),

    // English
    linksField({
      name: "footerLinks_en",
      title: "Footer links",
      group: "en",
      includeExternal: true,
    }),
    pageBuilderField({
      name: "pageBuilder_en",
      title: "Pre footer",
      group: "en",
      description: "Sections displayed before the footer on all pages",
    }),

    // Shared (not language-specific)
    figureField({
      title: "Illustration",
      name: "illustration",
      group: "shared",
      description: "Illustration displayed at the bottom center of the footer",
    }),
    referenceField({
      title: "Contact form",
      name: "contactForm",
      group: "shared",
      to: [{ type: "hubspotForm" }],
    }),
    infoField({
      title: "Automatically generated content",
      description:
        "Contact info, social media links and certifications are displayed automatically, based on the organisation settings.",
      tone: "positive",
      icon: Bot,
      group: "shared",
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
