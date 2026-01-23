import { Search } from "lucide-react";
import { defineType } from "sanity";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { sharedDocumentInfoField } from "@/schemas/generator-fields/shared-document-info.field";

export const metadataSettingsSchema = defineType({
  type: "document",
  name: "metadataSettings",
  title: "Standard SEO & metadata settings",
  icon: Search,
  options: {
    singleton: true,
  },
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
  ],
  fields: [
    sharedDocumentInfoField(),

    // Norwegian
    metadataField({ name: "metadata_no", isDefault: true, group: "no" }),

    // English
    metadataField({ name: "metadata_en", isDefault: true, group: "en" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Standard SEO & metadata settings",
      };
    },
  },
});
