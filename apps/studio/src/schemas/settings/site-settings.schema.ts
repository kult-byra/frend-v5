import { Globe } from "lucide-react";
import { defineField, defineType } from "sanity";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";

export const siteSettingsSchema = defineType({
  type: "document",
  title: "Globale innstillinger",
  name: "siteSettings",
  icon: Globe,
  options: {
    singleton: true,
  },
  fields: [
    referenceField({
      name: "frontPage",
      title: "Forside",
      to: [{ type: "frontPage" }],
      required: true,
    }),
    referenceField({
      name: "privacyPolicyPage",
      title: "Side for personvernerklæring",
      to: [{ type: "page" }],
      required: true,
    }),
    defineField({
      name: "banner",
      title: "Banner",
      description:
        "Vises helt øverst på nettsiden, på alle sider. Nyttig for kampanjer eller viktig informasjon.",
      type: "object",
      fields: [
        defineField({
          name: "showBanner",
          title: "Vis banner",
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
        title: "Globale innstillinger",
      };
    },
  },
});
