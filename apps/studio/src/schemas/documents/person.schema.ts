import { User } from "lucide-react";
import { defineField, defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";
import { figureField } from "../generator-fields/figure.field";

export const personSchema = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: User,
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
  ],
  fields: [
    stringField({
      name: "name",
      title: "Name",
      required: true,
    }),
    figureField({
      name: "image",
      title: "Image",
    }),

    // Norwegian
    stringField({
      name: "role_no",
      title: "Role",
      group: "no",
      required: true,
    }),

    // English
    stringField({
      name: "role_en",
      title: "Role",
      group: "en",
      required: true,
    }),

    defineField({
      title: "Works outside of Frend",
      name: "externalPerson",
      type: "boolean",
      initialValue: false,
    }),
    stringField({
      title: "Company",
      name: "company",
      hidden: ({ parent }) => parent?.externalPerson === false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role_no",
      media: "image",
    },
  },
});
