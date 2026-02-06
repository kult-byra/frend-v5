import { TextInitial } from "lucide-react";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { defineBlock } from "../utils/define-block.util";

export const contentBlockSchema = defineBlock({
  name: "content",
  title: "Content",
  icon: TextInitial,
  scope: ["pageBuilder"],
  fields: [
    portableTextField({
      includeHeadings: true,
      includeLists: true,
      includeBlocks: [
        "accordions.block",
        "figure",
        "callToAction.block",
        "logoCloud.block",
        "video.block",
        "mediaGallery.block",
        "quotes.block",
        "people.block",
        "button.block",
        "form.block",
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Content",
      };
    },
  },
});
