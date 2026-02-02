import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
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
  const {
    name,
    title,
    fields: originalFields,
    optionFields,
    components,
    icon,
    preview,
    scope,
  } = props;

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

  // Enhance preview to include the icon as media
  const enhancedPreview = preview
    ? {
        ...preview,
        prepare: (selection: Record<string, unknown>) => {
          const originalPrepare = preview.prepare as
            | ((selection: Record<string, unknown>) => {
                title?: string;
                subtitle?: string;
                media?: ReactNode;
              })
            | undefined;
          const result = originalPrepare ? originalPrepare(selection) : {};
          return {
            ...result,
            media: result.media ?? icon,
          };
        },
      }
    : {
        prepare: () => ({
          title: title ?? camelToNormal(name),
          media: icon,
        }),
      };

  const fieldDefinition = defineField(
    {
      ...props,
      name: `${name}.block`,
      title: title ?? camelToNormal(name),
      type: "object",
      fields,
      preview: enhancedPreview,
      components: {
        ...components,
        preview: PageBuilderBlockPreview,
      },
    },
    {
      strict: false,
    },
  );

  return {
    ...fieldDefinition,
    scope,
  };
};
