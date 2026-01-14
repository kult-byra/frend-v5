import { Package } from "lucide-react";
import { defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";

export const serviceSchema = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: Package,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      required: true,
    }),
  ],
});
