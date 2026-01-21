import { Bot, LayoutPanelTop } from "lucide-react";
import { defineField, defineType } from "sanity";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const servicesArchiveSchema = defineType({
  name: "servicesArchive",
  title: "Services overview",
  type: "document",
  icon: LayoutPanelTop,
  groups: defaultGroups,
  options: {
    singleton: true,
    linkable: true,
  },
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    ...heroFields({ isStatic: true, includeExcerpt: true }),
    infoField({
      title: "Automatically generated content",
      description: "All published services are displayed automatically.",
      tone: "positive",
      icon: Bot,
      group: ["key", "content"],
    }),
    metadataField(),
  ],
});
