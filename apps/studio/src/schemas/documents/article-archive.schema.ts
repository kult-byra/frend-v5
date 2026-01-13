import { Bot, LayoutPanelTop } from "lucide-react";
import { defineType } from "sanity";
import { infoField } from "@/schemas/generator-fields/info.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const articleArchiveSchema = defineType({
  name: "articleArchive",
  title: "Artikkeloversikt",
  type: "document",
  icon: LayoutPanelTop,
  groups: defaultGroups,
  options: {
    singleton: true,
    linkable: true,
  },
  fields: [
    stringField({
      name: "title",
      title: "Tittel",
      required: true,
      group: "key",
    }),
    slugField({ isStatic: true }),
    infoField({
      title: "Automatisk generert innhold",
      description: "Alle publiserte artikler vises automatisk.",
      tone: "positive",
      icon: Bot,
      group: ["key", "content"],
    }),
    metadataField(),
  ],
});
