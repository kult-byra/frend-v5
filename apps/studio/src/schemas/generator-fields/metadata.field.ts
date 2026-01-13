import { defineField, type ObjectDefinition } from "sanity";
import { figureField } from "@/schemas/generator-fields/figure.field";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export const metadataField = (
  props?: Omit<FieldDef<ObjectDefinition>, "title" | "name" | "fields" | "group"> & {
    group?: string | false;
    isDefault?: boolean;
  },
) => {
  const { group, isDefault } = props ?? {};

  return defineField({
    ...props,
    name: "metadata",
    title: isDefault ? "Standard SEO & metadata" : "SEO & metadata",
    type: "object",
    group: group === false ? undefined : (group ?? "meta"),
    fields: [
      defineField({
        name: "title",
        title: "Tittel for søkemotorer og sosiale medier",
        type: "string",
        validation: (Rule) =>
          Rule.max(50).warning("The title exceeds 50 characters and may me truncated (...)"),
      }),
      defineField({
        name: "desc",
        title: "Beskrivelse for søkemotorer og sosiale medier",
        type: "text",
        rows: 3,
        validation: (Rule) =>
          Rule.max(150).warning(
            "The description exceeds 150 characters and may me truncated (...)",
          ),
      }),
      figureField({
        name: "image",
        title: "Bilde for deling på sosiale medier",
        description: "Anbefalt størrelse: 1200x630 (PNG eller JPG)",
      }),
      ...(!isDefault
        ? [
            defineField({
              name: "tags",
              title: "Tags",
              description: "Synonymer og relaterte søkeord",
              type: "array",
              of: [{ type: "string" }],
              options: {
                layout: "tags",
              },
            }),
            defineField({
              name: "noIndex",
              title: "Ikke indeksér denne siden",
              description: "Hvis du skrur denne på, vil ikke siden være synlig for søkemotorer",
              type: "boolean",
            }),
          ]
        : []),
    ],
  });
};
