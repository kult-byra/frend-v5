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
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
  ],
  fields: [
    // Norwegian
    linksField({
      name: "mainMenu_no",
      title: "Main menu (left)",
      group: "no",
      includeExternal: true,
      includeLinkGroup: true,
    }),
    linksField({
      name: "secondaryMenu_no",
      title: "Secondary menu (right)",
      group: "no",
      includeExternal: true,
      includeLinkGroup: true,
    }),

    // English
    linksField({
      name: "mainMenu_en",
      title: "Main menu (left)",
      group: "en",
      includeExternal: true,
      includeLinkGroup: true,
    }),
    linksField({
      name: "secondaryMenu_en",
      title: "Secondary menu (right)",
      group: "en",
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
