import { User } from "lucide-react";
import { defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";

export const personSchema = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: User,
  fields: [
    stringField({
      name: "name",
      title: "Navn",
      required: true,
    }),
  ],
});
