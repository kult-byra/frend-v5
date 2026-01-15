import { Image } from "lucide-react";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { defineField } from "sanity";
import { figureField } from "../generator-fields/figure.field";

export const imageGalleryBlockSchema = defineBlock({
  name: "imageGallery",
  title: "Image gallery",
  icon: Image,
  scope: ["pageBuilder", "portableText"],
  fields: [
    defineField({
      title: "Images",
      name: "images",
      type: "array",
      of: [
        figureField({
            name: "image",
            title: "Image",
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(3).error("At least one image is required and at most three are allowed"),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Image gallery",
      };
    },
  },
}); 