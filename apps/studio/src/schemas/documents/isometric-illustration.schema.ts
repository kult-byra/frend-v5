import { Box } from "lucide-react";
import { defineType } from "sanity";
import { imageField } from "../generator-fields/image.field";
import { stringField } from "../generator-fields/string.field";

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
    imageField({
      name: "illustration",
      title: "Illustration",
      required: true,
    }),
  ],
});
