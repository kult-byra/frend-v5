import type { DatetimeDefinition } from "sanity";
import { defineField } from "sanity";

import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export const datetimeField = (
  props: Omit<FieldDef<DatetimeDefinition>, "options"> & {
    min?: string;
    max?: string;
  },
) => {
  const { required, min, max, validation } = props;

  return defineField({
    ...props,
    type: "datetime",
    options: {
      dateFormat: "DD.MM.YYYY",
      required,
    },
    validation: validation
      ? validation
      : (Rule) => {
          const rules = [];
          if (required) rules.push(Rule.required().error());
          if (min) rules.push(Rule.min(Rule.valueOfField(min)).error());
          if (max) rules.push(Rule.max(Rule.valueOfField(max)).error());
          return rules;
        },
  });
};
