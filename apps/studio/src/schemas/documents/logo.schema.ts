import { Image } from "lucide-react";
import { defineField, defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";

export const logoSchema = defineType({
  name: "logo",
  title: "Logo",
  type: "document",
  icon: Image,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      required: true,
      description: "Only visible in Sanity",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "file",
      description:
        "Upload an SVG file. Use a dark logo with transparent background for best results.",
      options: {
        accept: ".svg",
      },
      validation: (Rule) => Rule.required().error("Logo is required"),
    }),
  ],
});
