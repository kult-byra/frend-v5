import { Search } from "lucide-react";
import { defineType } from "sanity";
import { metadataField } from "@/schemas/generator-fields/metadata.field";

export const metadataSettingsSchema = defineType({
  type: "document",
  name: "metadataSettings",
  title: "Standard SEO & metadata",
  icon: Search,
  options: {
    singleton: true,
  },
  fields: [metadataField({ isDefault: true, group: false })],
  preview: {
    prepare() {
      return {
        title: "Standard SEO & metadata",
      };
    },
  },
});
