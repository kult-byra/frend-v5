import type { BooleanDefinition } from "sanity";
import { defineField } from "sanity";

import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export const booleanField = (props: FieldDef<BooleanDefinition>) => {
  const { required, validation } = props;

  return defineField({
    ...props,
    type: "boolean",
    validation: validation
      ? validation
      : (Rule) => {
          const rules = [];
          if (required) rules.push(Rule.required().error());
          return rules;
        },
  });
};
