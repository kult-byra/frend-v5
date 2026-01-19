import { Search } from "lucide-react";
import { defineField, defineType } from "sanity";
import { metadataField } from "@/schemas/generator-fields/metadata.field";

export const metadataSettingsSchema = defineType({
  type: "document",
  name: "metadataSettings",
  title: "Standard SEO & metadata settings",
  icon: Search,
  options: {
    singleton: true,
  },
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    metadataField({ isDefault: true, group: false }),
  ],
  preview: {
    prepare() {
      return {
        title: "Standard SEO & metadata settings",
      };
    },
  },
});
