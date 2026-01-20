import { Link } from "lucide-react";
import { linksField } from "../generator-fields/links.field";
import { defineBlock } from "../utils/define-block.util";

export const buttonBlockSchema = defineBlock({
  name: "button",
  title: "Button",
  icon: Link,
  scope: ["portableText"],
  fields: [
    linksField({
      title: "Button",
      name: "button",
      includeExternal: true,
      includeDownload: true,
      max: 1,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Button",
      };
    },
  },
});
