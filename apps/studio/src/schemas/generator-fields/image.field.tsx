import { Image } from "lucide-react";
import { defineField, type ImageDefinition, type ImageRule } from "sanity";
import {
  FIGURE_FIELDS,
  FigureInput,
  type FigureInputProps,
  sanityImageMetaQuery,
} from "@/components/inputs/figure-input.component";
import { env } from "@/env";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";
import type { BlockDefinition } from "@/schemas/utils/define-block.util";

export type ImageFieldOptions = FieldDef<ImageDefinition> & {
  scope?: BlockDefinition["scope"];
};

export const imageField = (props: ImageFieldOptions) => {
  const { required, validation, fields } = props;

  return defineField(
    {
      ...props,
      title: props.title ?? "Image",
      type: "image",
      icon: Image,
      options: {
        hotspot: {
          previews: [
            { title: "3:2", aspectRatio: 3 / 2 },
            { title: "3:4", aspectRatio: 3 / 4 },
            { title: "1:1", aspectRatio: 1 / 1 },
          ],
        },
        required,
      },
      fields: [
        ...(fields ? fields : []),
        defineField({
          type: "boolean",
          name: "changed",
          hidden: true,
        }),
      ],
      validation: validation
        ? validation
        : (Rule) => {
            const rules = [imageMetaValidationRule(Rule)];

            if (required)
              rules.push(
                Rule.custom((image) => {
                  if (!image?.asset) return "Bilde er påkrevd";

                  return true;
                }),
              );

            return rules;
          },
      components: {
        input: (props) => <FigureInput {...(props as FigureInputProps)} />,
      },
    },
    {
      strict: false,
    },
  );
};

export const imageMetaValidationRule = (Rule: ImageRule) =>
  Rule.custom(async (value, context) => {
    const imageId = value?.asset?._ref;

    if (!imageId) return true;

    const client = context.getClient({
      apiVersion: env.SANITY_STUDIO_API_VERSION,
    });

    const imageMeta = await client.fetch(sanityImageMetaQuery, { id: imageId });

    if (!imageMeta) return "Bilde mangler alt-tekst";

    const requiredFields = FIGURE_FIELDS.filter((field) => field.required);

    const invalidFields = requiredFields.filter((field) => {
      return !imageMeta[field.name] || imageMeta[field.name] === "";
    });

    if (invalidFields.length > 0) {
      const message = `Bilde mangler følgende verdier: ${invalidFields.join(", ")}`;
      return { valid: false, message };
    }
    return true;
  });

/** @deprecated Use imageField instead */
export const figureField = imageField;
