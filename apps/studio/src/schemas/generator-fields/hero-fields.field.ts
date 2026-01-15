import { defineField, type FieldDefinition } from "sanity";

import { datetimeField } from "@/schemas/generator-fields/datetime.field";
import { figureField } from "@/schemas/generator-fields/figure.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { referenceField } from "./reference.field";
import { portableTextField } from "./portable-text/portable-text.field";
import { linksField } from "./links.field";

export const heroFields = (options?: { 
  includePublishDate?: boolean; 
  multipleCoverImages?: boolean 
  includeAuthor?: boolean
  isStatic?: boolean
  includeExcerpt?: boolean
  includeCoverImage?: boolean
  includeLinks?: boolean
}): FieldDefinition[] => { const { 
    includePublishDate = false, 
    multipleCoverImages = false,
    includeAuthor = false,
    isStatic = false,
    includeExcerpt = false,
    includeCoverImage = true,
    includeLinks = false,
  } = options ?? {};

  return [
    stringField({
      name: "title",
      title: "Title",
      required: true,
      group: "key",
    }),
    slugField({ isStatic }),
    ...(includeExcerpt ? [portableTextField({
      title: "Excerpt",
      name: "excerpt",
      group: "key",
      noContent: true,
      includeLists: true,
    })] : []),
    ...(includePublishDate
      ? [
          datetimeField({
            name: "publishDate",
            title: "Publish date",
            group: "key",
            required: true,
            initialValue: () => new Date().toISOString(),
          }),
        ]
      : []),
    ...(includeCoverImage
      ? multipleCoverImages
        ? [
            defineField({
              title: "Cover image(s)",
              name: "coverImages",
              type: "array",
              of: [
                figureField({
                  name: "image",
                  title: "Image",
                }),
              ],
              group: "key",
              validation: (Rule) => Rule.min(1).max(3).error("At least one cover image is required and at most three are allowed"),
            }),
          ]
        : [
            figureField({
              name: "coverImage",
              title: "Cover image",
              group: "key",
            }),
          ]
      : []),
    ...(includeAuthor
      ? [
          referenceField({
            title: "Author",
            name: "author",
            to: [{ type: "person" }],
            group: "key",
          }),
        ]
      : []),
    ...(includeLinks
      ? [
          linksField({
            title: "Links",
            name: "links",
            includeExternal: true,
            includeDownload: true,
            max: 2,
            group: "key",
          }),
        ]
      : []),
  ];
};

