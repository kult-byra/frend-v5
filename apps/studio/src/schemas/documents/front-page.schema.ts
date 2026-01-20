import { Bookmark } from "lucide-react";
import { defineField, defineType } from "sanity";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const frontPageSchema = defineType({
  name: "frontPage",
  title: "Forside",
  type: "document",
  icon: Bookmark,
  groups: defaultGroups,
  options: {
    linkable: true,
  },
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    stringField({
      name: "title",
      title: "Front page title",
      required: true,
      group: "key",
      options: {
        tip: {
          title: "About front page title",
          description:
            "This title is used for internal reference only and will not be displayed on the website.",
        },
      },
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      group: "key",
    }),
    pageBuilderField({
      group: "content",
    }),
  ],
});
