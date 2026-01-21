import { Plus } from "lucide-react";
import { defineField } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";

export const accordionsBlockSchema = defineBlock({
  name: "accordions",
  title: "Accordions",
  icon: Plus,
  scope: ["portableText"],
  fields: [
    defineField({
      title: "Accordions",
      name: "accordions",
      type: "array",
      of: [
        defineField({
          title: "Accordion",
          name: "accordion",
          type: "object",
          fields: [
            stringField({
              name: "heading",
              title: "Heading",
              required: true,
            }),
            portableTextField({
              includeLists: true,
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Accordions",
      };
    },
  },
});
