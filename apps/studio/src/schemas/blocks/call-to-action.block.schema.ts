import { MousePointerClick } from "lucide-react";
import { defineField } from "sanity";
import { linksField } from "@/schemas/generator-fields/links.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { imageField } from "../generator-fields/image.field";

export const callToActionBlockSchema = defineBlock({
  name: "callToAction",
  title: "Call to action",
  icon: MousePointerClick,
  scope: ["portableText"],
  fields: [
    defineField({
      title: "Call to actions",
      name: "callToActions",
      type: "array",
      of: [
        defineField({
          title: "Call to action",
          name: "callToAction",
          type: "object",
          fields: [
            stringField({
              name: "heading",
              title: "Overskrift",
              required: true,
            }),
            imageField({
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
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Call to action",
      };
    },
  },
});
