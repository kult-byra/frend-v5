import type { LucideIcon } from "lucide-react";
import {
  defineField,
  type FieldDefinition,
  type ObjectDefinition,
  type ObjectSchemaType,
} from "sanity";
import { PageBuilderBlockPreview } from "@/components/previews/page-builder-block-preview.component";
import { widthField } from "@/schemas/generator-fields/width.field";
import { camelToNormal } from "@/utils/string.util";

type BlockScope = "pageBuilder" | "portableText";

type BlockExtras = {
  icon: LucideIcon;
  scope: BlockScope[];
  optionFields?: FieldDefinition[];
};

export type BlockDefinition = Omit<ObjectDefinition, "type" | "icon"> & BlockExtras;

export type BlockSchemaType = Omit<ObjectSchemaType, "icon"> & BlockExtras;

export const defineBlock = (props: BlockDefinition) => {
  const { name, title, fields: originalFields, optionFields, components } = props;

  const fields = originalFields ?? [];

  // Always add options with width field (and any additional optionFields)
  const allOptionFields = [widthField(), ...(optionFields ?? [])];

  fields.push(
    defineField({
      name: "options",
      title: "Options",
      type: "object",
      fields: allOptionFields,
    }),
  );

  return defineField(
    {
      ...props,
      name: `${name}.block`,
      title: title ?? camelToNormal(name),
      type: "object",
      fields,
      components: {
        ...components,
        preview: PageBuilderBlockPreview,
      },
    },
    {
      strict: false,
    },
  );
};
