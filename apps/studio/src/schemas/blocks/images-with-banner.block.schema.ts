import { ImagePlus } from "lucide-react";
import { defineField } from "sanity";
import { linksField } from "../generator-fields/links.field";
import { mediaField } from "../generator-fields/media.field";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { referenceField } from "../generator-fields/reference.field";
import { stringField } from "../generator-fields/string.field";
import { defineBlock } from "../utils/define-block.util";

export const imagesWithBannerBlockSchema = defineBlock({
  name: "imagesWithBanner",
  title: "Images with banner",
  icon: ImagePlus,
  scope: ["portableText", "pageBuilder"],
  fields: [
    stringField({
      name: "heading",
      title: "Heading",
      required: true,
    }),
    portableTextField({
      name: "text",
      title: "Text",
      noContent: true,
      includeLists: true,
    }),
    stringField({
      title: "CTA type",
      name: "ctaType",
      options: {
        list: [
          { title: "Link", value: "link" },
          { title: "Form", value: "form" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "link",
    }),
    linksField({
      title: "Link",
      name: "link",
      includeExternal: true,
      includeDownload: true,
      max: 1,
      hidden: ({ parent }) => parent?.ctaType === "form",
    }),
    referenceField({
      title: "Form",
      name: "form",
      to: [{ type: "hubspotForm" }],
      hidden: ({ parent }) => parent?.ctaType !== "form",
    }),
    defineField({
      title: "Images",
      name: "images",
      type: "array",
      of: [
        mediaField({
          name: "media",
          title: "Image or Video",
          video: true,
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(2)
          .error("At least one image is required and at most two are allowed"),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Images with banner",
      };
    },
  },
});
