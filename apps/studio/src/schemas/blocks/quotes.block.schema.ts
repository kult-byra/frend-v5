import { LayoutGrid, Maximize2, Quote } from "lucide-react";
import { gridOptionsField } from "../generator-fields/grid-options.field";
import { referenceField } from "../generator-fields/reference.field";
import { defineBlock } from "../utils/define-block.util";

export const quotesBlockSchema = defineBlock({
  name: "quotes",
  title: "Quotes",
  icon: Quote,
  scope: ["pageBuilder", "portableText"],
  fields: [
    referenceField({
      title: "Quotes",
      name: "quotes",
      to: [{ type: "quote" }],
      allowMultiple: true,
    }),
  ],
  optionFields: [
    gridOptionsField({
      name: "layout",
      title: "Desktop layout",
      description: "Choose the layout width for this block",
      options: [
        {
          value: "default",
          title: "Default",
          description: "Content constrained to the content container on right side of screen",
          icon: LayoutGrid,
        },
        {
          value: "fullWidth",
          title: "Full Width",
          description: "Content spans the full width of the page",
          icon: Maximize2,
        },
      ],
      initialValue: "default",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Quotes",
      };
    },
  },
});
