import { Bookmark } from "lucide-react";
import { defineField, defineType } from "sanity";
import { heroField } from "@/schemas/generator-fields/hero.field";
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
    heroField({
      name: "hero",
      types: ["mediaHero", "stickyHero"],
      group: "key",
    }),
    pageBuilderField({
      group: "content",
    }),
  ],
});
