import { Image } from "lucide-react";
import { defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";
import { figureField } from "../generator-fields/figure.field";

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
    figureField({
      name: "image",
      title: "Image",
      required: true,
      description: "Use a dark logo with transparent background for best results.",
    }),
  ],
});
