// TODO: Update with def from kult-astro repo

import type { ArrayDefinition } from "sanity";
import { defineField } from "sanity";
import { CheckSquare, List, ListOrdered, Minus } from "lucide-react";

import { downloadLinkObjectField } from "@/schemas/generator-fields/download-link-object.field";
import { externalLinkObjectField } from "@/schemas/generator-fields/external-link-object.field";
import { internalLinkObjectField } from "@/schemas/generator-fields/internal-link-object.field";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

type PortableText = FieldDef<Omit<ArrayDefinition, "of">> & {
  includeBlocks?: string[];
  includeLists?: boolean;
  includeLinks?: boolean;
  includeHeadings?: boolean;
};

type DefaultName = Omit<PortableText, "name"> & {
  name?: never;
  noContent?: never;
};

type CustomName = PortableText & {
  noContent: true;
};

export type PortableTextFieldProps<NoContent = boolean> = NoContent extends true
  ? CustomName
  : DefaultName;

// HEADINGS
/* Will be included if includeHeadings == true */
const headingStyles = [
  { title: "H2", value: "h2" },
  { title: "H3", value: "h3" },
  { title: "H4", value: "h4" },
];

// LISTS
/* Will be included if includeLists == true */
const listObjects = [
  { title: "Bullet list", value: "bullet", icon: List },
  { title: "Numbered list", value: "number", icon: ListOrdered },
  { title: "Dash list", value: "dash", icon: Minus },
  { title: "Checklist", value: "check", icon: CheckSquare },
];

// LINKS (always included)
const linkObjects = [internalLinkObjectField, externalLinkObjectField, downloadLinkObjectField];

// DECORATORS (always included)
const basicDecorators = [
  { title: "Fet", value: "strong" },
  { title: "Kursiv", value: "em" },
];

export const portableTextField = (props?: PortableTextFieldProps) => {
  const {
    includeBlocks,
    includeHeadings,
    includeLists,
    includeLinks = true,
    options,
    required,
    validation,
  } = props ?? {};

  const styles = [];
  if (includeHeadings) styles.push(...headingStyles);

  return defineField({
    ...props,
    name: props?.noContent ? props.name : "content",
    title: props?.title ?? "Content",
    type: "array",
    of: [
      {
        type: "block",
        styles: styles,
        lists: includeLists ? listObjects : [],
        marks: {
          decorators: basicDecorators,
          annotations: includeLinks ? linkObjects : [],
        },
      },
      ...(includeBlocks ? includeBlocks.map((type) => ({ type })) : []),
    ],
    validation: validation
      ? validation
      : (Rule) => {
          const rules = [];
          if (required) rules.push(Rule.required().error());
          return rules;
        },
    options: {
      ...options,
      required,
    },
  });
};
