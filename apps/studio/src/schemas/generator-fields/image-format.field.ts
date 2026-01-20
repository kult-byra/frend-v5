import type { StringDefinition } from "sanity";
import { defineField } from "sanity";

import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export const imageFormatField = (
  props?: Partial<FieldDef<StringDefinition>> & { name?: string },
) => {
  const { required, validation, name = "imageFormat", title = "Image Format" } = props ?? {};

  return defineField({
    ...props,
    name,
    title,
    type: "string",
    options: {
      list: [
        { title: "3:2", value: "3:2" },
        { title: "3:4", value: "3:4" },
        { title: "1:1", value: "1:1" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    initialValue: "3:2",
    validation: validation
      ? validation
      : (Rule) => {
          const rules = [];
          if (required) rules.push(Rule.required().error());
          return rules;
        },
  });
};
