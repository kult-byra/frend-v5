import { Code } from "lucide-react";
import { defineType } from "sanity";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";

export const technologySchema = defineType({
  name: "technology",
  title: "Technology",
  type: "document",
  icon: Code,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      required: true,
    }),
    referenceField({
      name: "logo",
      title: "Logo",
      to: [{ type: "logo" }],
      description: "Technology logo or icon",
    }),
  ],
});
