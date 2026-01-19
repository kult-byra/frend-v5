import { User } from "lucide-react";
import { defineField, defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";
import { figureField } from "../generator-fields/figure.field";

export const personSchema = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: User,
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    stringField({
      name: "name",
      title: "Navn",
      required: true,
    }),
    figureField({
      name: "image",
      title: "Bilde",
    }),
    stringField({
      name: "role",
      title: "Rolle",
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
});
