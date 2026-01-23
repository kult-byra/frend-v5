import { Bot, LayoutPanelTop } from "lucide-react";
import { defineType } from "sanity";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { sharedDocumentInfoField } from "@/schemas/generator-fields/shared-document-info.field";
import { slugField } from "@/schemas/generator-fields/slug.field";

export const newsAndEventsArchiveSchema = defineType({
  name: "newsAndEventsArchive",
  title: "News and events overview",
  type: "document",
  icon: LayoutPanelTop,
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
  ],
  options: {
    singleton: true,
    linkable: true,
  },
  fields: [
    sharedDocumentInfoField(),
    slugField({ isStatic: true, group: false }),

    // Norwegian
    ...heroFields({ isStatic: true, suffix: "_no", group: "no" }),
    metadataField({ suffix: "_no", group: "no" }),

    // English
    ...heroFields({ isStatic: true, suffix: "_en", group: "en" }),
    metadataField({ suffix: "_en", group: "en" }),

    infoField({
      title: "Automatically generated content",
      description: "All published news and events are displayed automatically.",
      tone: "positive",
      icon: Bot,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "News and events overview",
      };
    },
  },
});
