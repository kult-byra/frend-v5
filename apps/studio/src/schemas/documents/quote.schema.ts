import { Quote } from "lucide-react";
import { stringField } from "../generator-fields/string.field";
import { defineField, defineType } from "sanity";


export const quoteSchema = defineType({
  name: "quote",
  title: "Quote",
  type: "document",
  icon: Quote,
  fields: [
    defineField({
      title: "Quote",
      name: "quote",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().error("Quote is required"),
    }),
    defineField({
        title: "Source",
        name: "source",
        type: "object",
        fields: [
            stringField({
                title: "Name",
                name: "name",
                validation: (Rule) => Rule.required().error("Name is required"),
            }),
            stringField({
                title: "Role",
                name: "role",
                validation: (Rule) => Rule.required().error("Role is required"),
            }),
        ],
    }),
  ],
  preview: {
    select: {
      title: "quote",
      subtitle: "source.name",
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.subtitle,
      };
    },
  },
});