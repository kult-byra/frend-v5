import { Bot, LayoutPanelTop } from "lucide-react";
import { defineType } from "sanity";
import { infoField } from "@/schemas/generator-fields/info.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const newsAndEventsArchiveSchema = defineType({
  name: "newsAndEventsArchive",
  title: "News and events (archive)",
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
      title: "Title",
      required: true,
      group: "key",
      description: "Only shown in the studio",
    }),
    slugField({ isStatic: true }),
    infoField({
      title: "Automatically generated content",
      description: "All published news and events are displayed automatically.",
      tone: "positive",
      icon: Bot,
      group: ["key", "content"],
    }),
    metadataField(),
  ],
});
