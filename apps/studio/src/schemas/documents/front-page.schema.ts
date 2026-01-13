import { Bookmark } from "lucide-react";
import { defineType } from "sanity";
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
    stringField({
      name: "title",
      title: "Tittel",
      required: true,
      group: "key",
      options: {
        tip: {
          title: "Om forsidetittel",
          description:
            "Denne tittelen brukes kun som intern referanse, og vil ikke vises på nettsiden.",
        },
      },
    }),
    pageBuilderField(),
  ],
});
