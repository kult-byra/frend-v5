import { Grid2x2 } from "lucide-react";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { defineField } from "sanity";

export const logoCloudBlockSchema = defineBlock({
  name: "logoCloud",
  title: "Logo cloud",
  icon: Grid2x2,
  scope: ["pageBuilder", "portableText"],
  fields: [
    defineField({
        title: "Logos",
        name: "logos",
        type: "array",
        of: [{ type: "reference", to: [{ type: "logo" }] }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Logo cloud",
      };
    },
  },
});
