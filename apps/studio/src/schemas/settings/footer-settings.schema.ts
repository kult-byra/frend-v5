import { Bot, PanelBottom } from "lucide-react";
import { defineField, defineType } from "sanity";
import { linksField } from "@/schemas/generator-fields/links.field";
import { illustrationField } from "../generator-fields/illustration.field";
import { infoField } from "../generator-fields/info.field";
import { mediaField } from "../generator-fields/media.field";
import { pageBuilderField } from "../generator-fields/page-builder.field";
import { referenceField } from "../generator-fields/reference.field";
import { sharedDocumentInfoField } from "../generator-fields/shared-document-info.field";

export const footerSettingsSchema = defineType({
  type: "document",
  name: "footerSettings",
  title: "Footer",
  icon: PanelBottom,
  options: {
    singleton: true,
  },
  fieldsets: [
    {
      name: "newsletter",
      title: "Newsletter",
      options: { collapsible: true },
    },
  ],
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
    { name: "shared", title: "Shared" },
  ],
  fields: [
    sharedDocumentInfoField({ groups: ["no", "en", "shared"] }),

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
    defineField({
      name: "newsletterText_no",
      title: "Newsletter text",
      type: "text",
      rows: 2,
      group: "no",
      fieldset: "newsletter",
      description: "Text displayed above the newsletter signup form",
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
    defineField({
      name: "newsletterText_en",
      title: "Newsletter text",
      type: "text",
      rows: 2,
      group: "en",
      fieldset: "newsletter",
      description: "Text displayed above the newsletter signup form",
    }),

    // Shared (not language-specific)
    illustrationField({
      title: "Illustration",
      name: "illustration",
      group: "shared",
      description: "Illustration displayed at the bottom center of the footer (desktop only)",
    }),
    mediaField({
      title: "Mobile illustration",
      name: "mobileIllustration",
      group: "shared",
      description:
        "Illustration displayed at the bottom center of the footer on mobile devices only",
      image: false,
      illustration: true,
    }),
    referenceField({
      title: "Newsletter signup form",
      name: "newsletterForm",
      group: "shared",
      fieldset: "newsletter",
      description:
        "Select a HubSpot form for newsletter signup. This form should have only an email field.",
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
