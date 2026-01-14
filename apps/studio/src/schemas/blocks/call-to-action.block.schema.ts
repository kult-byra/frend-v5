import { MousePointerClick } from "lucide-react";
import { linksField } from "@/schemas/generator-fields/links.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { figureField } from "../generator-fields/figure.field";

export const callToActionBlockSchema = defineBlock({
  name: "callToAction",
  title: "Call to action",
  icon: MousePointerClick,
  scope: ["pageBuilder", "portableText"],
  fields: [
    stringField({
      name: "heading",
      title: "Overskrift",
      required: true,
    }),
    figureField({
      name: "image",
      title: "Image",
    }),
    portableTextField(),
    linksField({
      name: "links",
      title: "Lenker",
      includeExternal: true,
      includeDownload: true,
      max: 2,
    }),
  ],
});
