import type { StringDefinition } from "sanity";
import { defineField } from "sanity";
import { ColorInput, type ColorInputProps } from "@/components/inputs/color-input.component";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export const colorField = (
  props: FieldDef<Omit<StringDefinition, "name" | "initialValue">> &
    ColorInputProps & {
      name?: string;
      initialValue?: string | false;
    },
) => {
  const {
    colors,
    initialValue,
    name = "color",
    title = "Farge",
    options,
    required,
    validation,
  } = props ?? {};

  return defineField({
    ...props,
    name,
    title,
    type: "string",
    initialValue: initialValue === false ? undefined : initialValue ? initialValue : colors[0],
    components: {
      input: (inputProps) => <ColorInput {...inputProps} colors={colors} />,
    },
    options: {
      ...options,
      list: colors.map((color) => ({
        title: color,
        value: color,
      })),
      required: required,
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
