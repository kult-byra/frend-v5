import { Briefcase } from "lucide-react";
import { defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";

export const industrySchema = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  icon: Briefcase,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      required: true,
    }),
  ],
});
