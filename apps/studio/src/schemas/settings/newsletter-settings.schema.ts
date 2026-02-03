import { Mail } from "lucide-react";
import { defineType } from "sanity";

import { referenceField } from "@/schemas/generator-fields/reference.field";
import { sharedDocumentInfoField } from "@/schemas/generator-fields/shared-document-info.field";

export const newsletterSettingsSchema = defineType({
  type: "document",
  name: "newsletterSettings",
  title: "Newsletter",
  icon: Mail,
  options: {
    singleton: true,
  },
  groups: [
    { name: "no", title: "Norsk", default: true },
    { name: "en", title: "English" },
  ],
  fields: [
    sharedDocumentInfoField({ groups: ["no", "en"] }),

    // Norwegian
    referenceField({
      name: "newsletterSignup_no",
      title: "Newsletter signup form",
      description: "Select a HubSpot form for newsletter signup",
      to: [{ type: "hubspotForm" }],
      group: "no",
    }),

    // English
    referenceField({
      name: "newsletterSignup_en",
      title: "Newsletter signup form",
      description: "Select a HubSpot form for newsletter signup",
      to: [{ type: "hubspotForm" }],
      group: "en",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Newsletter",
      };
    },
  },
});
