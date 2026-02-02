import { Bot, LayoutPanelTop } from "lucide-react";
import { defineField, defineType } from "sanity";
import { infoField } from "@/schemas/generator-fields/info.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { sharedDocumentInfoField } from "@/schemas/generator-fields/shared-document-info.field";
import { slugField } from "@/schemas/generator-fields/slug.field";

export const clientArchiveSchema = defineType({
  name: "clientArchive",
  title: "Client overview",
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
    defineField({
      name: "hero_no",
      title: "Hero (Norwegian)",
      type: "hero",
      group: "no",
    }),
    metadataField({ suffix: "_no", group: "no" }),

    // English
    defineField({
      name: "hero_en",
      title: "Hero (English)",
      type: "hero",
      group: "en",
    }),
    metadataField({ suffix: "_en", group: "en" }),

    infoField({
      title: "Automatically generated content",
      description: "All published clients are displayed automatically.",
      tone: "positive",
      icon: Bot,
    }),
  ],
  preview: {
    select: {
      titleNo: "hero_no.mediaHero.title",
      titleNoText: "hero_no.textHero.title",
      titleEn: "hero_en.mediaHero.title",
      titleEnText: "hero_en.textHero.title",
    },
    prepare({ titleNo, titleNoText, titleEn, titleEnText }) {
      const title = titleNo || titleNoText || titleEn || titleEnText;
      return {
        title: title || "Client overview",
      };
    },
  },
});
