import { ImageIcon } from "lucide-react";
import type { StringDefinition } from "sanity";
import { defineField } from "sanity";
import {
  IllustrationInput,
  type IllustrationInputProps,
} from "@/components/inputs/illustration-input.component";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";
import {
  ILLUSTRATIONS,
  type IllustrationMode,
  type IllustrationType,
} from "@/utils/illustrations.const";

type IllustrationFieldProps = FieldDef<Omit<StringDefinition, "name">> &
  IllustrationInputProps & {
    name?: string;
    filterMode?: IllustrationMode;
    filterType?: IllustrationType;
  };

export const illustrationField = (props: IllustrationFieldProps) => {
  const {
    name = "illustration",
    title = "Illustration",
    required,
    validation,
    filterMode,
    filterType,
    ...rest
  } = props;

  // Filter illustrations based on props for the options list
  const filteredNames = ILLUSTRATIONS.filter((i) => {
    if (filterMode && i.mode !== filterMode) return false;
    if (filterType && i.type !== filterType) return false;
    return true;
  }).map((i) => i.name);

  return defineField({
    ...rest,
    name,
    title,
    type: "string",
    icon: ImageIcon,
    components: {
      input: (inputProps) => (
        <IllustrationInput {...inputProps} filterMode={filterMode} filterType={filterType} />
      ),
    },
    options: {
      list: filteredNames.map((illustrationName) => ({
        title: illustrationName,
        value: illustrationName,
      })),
    },
    validation: validation
      ? validation
      : (Rule) => {
          const rules = [];
          if (required) {
            rules.push(Rule.required().error("Illustration is required"));
          }
          return rules;
        },
  });
};
