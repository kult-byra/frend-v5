import { Bot, LayoutPanelTop } from "lucide-react";
import { defineType } from "sanity";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const eBookArchiveSchema = defineType({
  name: "eBookArchive",
  title: "E-books overview",
  type: "document",
  icon: LayoutPanelTop,
  groups: defaultGroups,
  options: {
    singleton: true,
    linkable: true,
  },
  fields: [
    ...heroFields({ isStatic: true, includeCoverImage: false }),
    infoField({
      title: "Automatically generated content",
      description: "All published e-books are displayed automatically.",
      tone: "positive",
      icon: Bot,
      group: ["key", "content"],
    }),
    metadataField(),
  ],
});

