import { Box } from "lucide-react";
import { defineType } from "sanity";
import { stringField } from "../generator-fields/string.field";
import { figureField } from "../generator-fields/figure.field";

export const isometricIllustrationSchema = defineType({
  name: "isometricIllustration",
  title: "Isometric illustration",
  type: "document",
  icon: Box,
  fields: [
    stringField({
        name: "title",
        title: "Title",
        description: "Only visible in Sanity",
    }),
    figureField({
        name: "illustration",
        title: "Illustration",
        required: true,
    }),
  ]
});