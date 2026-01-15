import { Columns2 } from "lucide-react";
import { figureField } from "@/schemas/generator-fields/figure.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { defineField } from "sanity";

export const imagesAndTextBlockSchema = defineBlock({
  name: "imagesAndText",
  title: "Images and text",
  icon: Columns2,
  scope: ["portableText", "pageBuilder"],
  fields: [
    stringField({
      name: "heading",
      title: "Heading",
      required: true,
    }),
    portableTextField({
      includeLists: true,
    }),
    linksField({
      name: "links",
      title: "Links",
      includeExternal: true,
      includeDownload: true,
      max: 2,
    }),
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
  optionFields: [
    stringField({
      name: "imagePosition",
      title: "Image position",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "left",
    }),
  ],
});
