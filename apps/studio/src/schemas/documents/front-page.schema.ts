import { Bookmark } from "lucide-react";
import { defineField, defineType } from "sanity";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { linksField } from "../generator-fields/links.field";

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
    stringField({
      name: "heading",
      title: "Heading",
      required: true,
      group: "key",
    }),
    portableTextField({
      title: "Excerpt",
      name: "excerpt",
      group: "key",
      noContent: true,
    }),
    linksField({
      title: "Links",
      name: "links",
      includeExternal: true,
      includeDownload: true,
      max: 2,
      group: "key",
    }),
    pageBuilderField({
      group: "content",
    }),
  ],
});
