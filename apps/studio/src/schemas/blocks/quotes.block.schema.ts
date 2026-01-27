import { Quote } from "lucide-react";
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
  preview: {
    prepare() {
      return {
        title: "Quotes",
      };
    },
  },
});
