import { Globe } from "lucide-react";
import { defineField, defineType } from "sanity";
import { imageField } from "@/schemas/generator-fields/image.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { sharedDocumentInfoField } from "@/schemas/generator-fields/shared-document-info.field";

export const siteSettingsSchema = defineType({
  type: "document",
  title: "Global settings",
  name: "siteSettings",
  icon: Globe,
  options: {
    singleton: true,
  },
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
  ],
  fields: [
    sharedDocumentInfoField(),

    // Global (not language-specific)
    imageField({
      name: "videoPlaceholder",
      title: "Video placeholder",
      description:
        "Shown while videos are loading. Use a branded image or abstract visual that works across the site.",
    }),

    // Norwegian
    referenceField({
      name: "frontPage_no",
      title: "Front page",
      group: "no",
      to: [{ type: "frontPage" }],
      required: true,
    }),
    referenceField({
      name: "privacyPolicyPage_no",
      title: "Page for privacy policy",
      group: "no",
      to: [{ type: "page" }],
      required: true,
    }),
    defineField({
      name: "banner_no",
      title: "Banner",
      group: "no",
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

    // English
    referenceField({
      name: "frontPage_en",
      title: "Front page",
      group: "en",
      to: [{ type: "frontPage" }],
      required: true,
    }),
    referenceField({
      name: "privacyPolicyPage_en",
      title: "Page for privacy policy",
      group: "en",
      to: [{ type: "page" }],
      required: true,
    }),
    defineField({
      name: "banner_en",
      title: "Banner",
      group: "en",
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
