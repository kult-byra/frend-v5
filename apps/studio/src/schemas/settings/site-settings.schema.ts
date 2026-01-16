import { Globe } from "lucide-react";
import { defineField, defineType } from "sanity";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";

export const siteSettingsSchema = defineType({
  type: "document",
  title: "Global settings",
  name: "siteSettings",
  icon: Globe,
  options: {
    singleton: true,
  },
  fields: [
    referenceField({
      name: "frontPage",
      title: "Front page",
      to: [{ type: "frontPage" }],
      required: true,
    }),
    referenceField({
      name: "privacyPolicyPage",
      title: "Page for privacy policy",
      to: [{ type: "page" }],
      required: true,
    }),
    defineField({
      name: "banner",
      title: "Banner",
      description:
        "Shown at the top of the website, on all pages. Useful for campaigns or important information.",
      type: "object",
      fields: [
        defineField({
          name: "showBanner",
          title: "Show banner",
          type: "boolean",
        }),
        portableTextField({
          hidden: ({ parent }) => !parent?.showBanner,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Global settings",
      };
    },
  },
});
