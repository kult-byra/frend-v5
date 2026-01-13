import { Menu } from "lucide-react";
import { defineType } from "sanity";
import { linksField } from "@/schemas/generator-fields/links.field";

export const menuSettingsSchema = defineType({
  type: "document",
  name: "menuSettings",
  title: "Menyer",
  icon: Menu,
  options: {
    singleton: true,
  },
  fields: [
    linksField({
      name: "mainMenu",
      title: "Hovedmeny",
      includeExternal: true,
      includeLinkGroup: true,
      includeDescriptionInLinkGroup: true,
    }),
    linksField({
      name: "button",
      title: "Knapp",
      max: 1,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Menyer",
      };
    },
  },
});
