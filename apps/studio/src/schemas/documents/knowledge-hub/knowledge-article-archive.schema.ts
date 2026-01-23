import { Bot, LayoutPanelTop } from "lucide-react";
import { defineType } from "sanity";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { sharedDocumentInfoField } from "@/schemas/generator-fields/shared-document-info.field";
import { slugField } from "@/schemas/generator-fields/slug.field";

export const knowledgeArticleArchiveSchema = defineType({
  name: "knowledgeArticleArchive",
  title: "Knowledge articles overview",
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
    ...heroFields({ isStatic: true, includeCoverImage: false, suffix: "_no", group: "no" }),
    metadataField({ suffix: "_no", group: "no" }),

    // English
    ...heroFields({ isStatic: true, includeCoverImage: false, suffix: "_en", group: "en" }),
    metadataField({ suffix: "_en", group: "en" }),

    infoField({
      title: "Automatically generated content",
      description: "All published knowledge articles are displayed automatically.",
      tone: "positive",
      icon: Bot,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Knowledge articles overview",
      };
    },
  },
});
