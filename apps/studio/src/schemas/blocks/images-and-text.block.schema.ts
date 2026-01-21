import { Columns2 } from "lucide-react";
import { defineField } from "sanity";
import { linksField } from "@/schemas/generator-fields/links.field";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defineBlock } from "@/schemas/utils/define-block.util";

export const imagesAndTextBlockSchema = defineBlock({
  name: "imagesAndText",
  title: "Images and text",
  icon: Columns2,
  scope: ["portableText", "pageBuilder"],
  fields: [
    stringField({
      name: "heading",
      title: "Heading",
    }),
    portableTextField({
      includeLists: true,
    }),
    linksField({
      name: "links",
      title: "Links",
      includeExternal: true,
      includeDownload: true,
      max: 2,
    }),
    defineField({
      title: "Images",
      name: "images",
      type: "array",
      of: [
        mediaField({
          name: "media",
          title: "Image/video",
          video: true,
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(3)
          .error("At least one image is required and at most three are allowed"),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Images and text",
      };
    },
  },
});
