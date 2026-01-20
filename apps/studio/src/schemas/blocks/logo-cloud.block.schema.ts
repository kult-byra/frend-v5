import { Grid2x2 } from "lucide-react";
import { defineField } from "sanity";
import { defineBlock } from "@/schemas/utils/define-block.util";

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
