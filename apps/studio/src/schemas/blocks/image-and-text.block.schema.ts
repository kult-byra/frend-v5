import { Columns2 } from "lucide-react";
import { figureField } from "@/schemas/generator-fields/figure.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defineBlock } from "@/schemas/utils/define-block.util";

export const imageAndTextBlockSchema = defineBlock({
  name: "imageAndText",
  title: "Image and text",
  icon: Columns2,
  scope: ["pageBuilder", "portableText"],
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
    figureField({
      name: "image",
      required: true,
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
