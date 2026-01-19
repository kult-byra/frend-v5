import { Menu } from "lucide-react";
import { defineType } from "sanity";
import { linksField } from "@/schemas/generator-fields/links.field";

export const menuSettingsSchema = defineType({
  type: "document",
  name: "menuSettings",
  title: "Menus",
  icon: Menu,
  options: {
    singleton: true,
  },
  fields: [
    linksField({
      name: "mainMenu",
      title: "Main menu (left)",
      includeExternal: true,
      includeLinkGroup: true,
    }),
    linksField({
      name: "secondaryMenu",
      title: "Secondary menu (right)",
      includeExternal: true,
      includeLinkGroup: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Menus",
      };
    },
  },
});
