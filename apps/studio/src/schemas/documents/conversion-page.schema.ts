import { Bookmark, Bot, Phone } from "lucide-react";
import { defineField, defineType } from "sanity";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { heroFields } from "../generator-fields/hero-fields.field";
import { infoField } from "../generator-fields/info.field";
import { linksField } from "../generator-fields/links.field";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { referenceField } from "../generator-fields/reference.field";

export const conversionPageSchema = defineType({
  name: "conversionPage",
  title: "Conversion page",
  type: "document",
  icon: Phone,
  groups: defaultGroups,
  options: {
    linkable: true,
  },
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    ...heroFields({
      includeExcerpt: true,
    }),
    referenceField({
      title: "Contact form",
      name: "contactForm",
      to: [{ type: "hubspotForm" }],
      group: "key",
    }),
    referenceField({
      title: "Highlighted clients",
      name: "highlightedClients",
      to: [{ type: "client" }],
      group: "content",
      allowMultiple: true,
      max: 5,
    }),
    referenceField({
      title: "Highlighted quotes",
      name: "highlightedQuotes",
      to: [{ type: "quote" }],
      group: "content",
      allowMultiple: true,
    }),
    pageBuilderField({
      group: "content",
    }),
  ],
});
