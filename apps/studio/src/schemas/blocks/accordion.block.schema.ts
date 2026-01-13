import { Plus } from "lucide-react";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defineBlock } from "@/schemas/utils/define-block.util";

export const accordionBlockSchema = defineBlock({
  name: "accordion",
  title: "Trekkspill",
  icon: Plus,
  scope: ["portableText"],
  fields: [
    stringField({
      name: "heading",
      title: "Overskrift",
      required: true,
    }),
  ],
});
