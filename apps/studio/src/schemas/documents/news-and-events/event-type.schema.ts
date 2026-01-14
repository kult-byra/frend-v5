
import { Tag } from "lucide-react";
import { defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";

export const eventTypeSchema = defineType({
  name: "eventType",
  title: "Event type",
  type: "document",
  icon: Tag,
  fields: [
    stringField({
      name: "title",
      title: "Title",
      required: true,
    }),
  ],
});
