import type { StringDefinition } from "sanity";
import { defineField } from "sanity";
import type { GridOption } from "@/components/inputs/grid-options-input.component";
import { GridOptionsInput } from "@/components/inputs/grid-options-input.component";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export type GridOptionsFieldProps = {
  options: GridOption[];
  initialValue?: string;
};

export const gridOptionsField = (
  props: FieldDef<StringDefinition> & GridOptionsFieldProps,
) => {
  const { name, title, description, options, initialValue, required, validation } = props;

  return defineField({
    ...props,
    name,
    title,
    description,
    type: "string",
    initialValue,
    components: {
      input: (inputProps) => <GridOptionsInput {...inputProps} options={options} />,
    },
    options: {
      list: options.map((option) => ({
        title: option.title,
        value: option.value,
      })),
    },
    validation: validation
      ? validation
      : (Rule) => {
          const rules = [];
          if (required) rules.push(Rule.required().error());
          return rules;
        },
  });
};
