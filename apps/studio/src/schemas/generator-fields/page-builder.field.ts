import type { ArrayDefinition } from "sanity";
import { defineField } from "sanity";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

import { PAGE_BUILDER_BLOCK_TYPES } from "@/utils/page-builder-block-types.util";
import { camelToKebab } from "@/utils/string.util";

export const pageBuilderField = (
  props?: Omit<FieldDef<ArrayDefinition>, "of" | "name" | "group"> & {
    name?: string;
    group?: string | false;
  },
) => {
  const { options, title, required, group, name } = props ?? {};

  return defineField({
    ...props,
    name: name ?? "pageBuilder",
    title: title ?? "Page builder",
    type: "array",
    group: group === false ? undefined : (group ?? ["key", "content"]),
    of: PAGE_BUILDER_BLOCK_TYPES.map((type) => ({ type })),
    options: {
      ...options,
      required,
      insertMenu: {
        filter: true,
        views: [
          {
            name: "grid",
            previewImageUrl: (schemaTypeName) => {
              const kebabName = camelToKebab(schemaTypeName);
              const imageName = kebabName.split(".block")[0];
              const imageSrc = `/blocks/${imageName}.png`;

              return imageSrc;
            },
          },
          { name: "list" },
        ],
      },
    },
  });
};
