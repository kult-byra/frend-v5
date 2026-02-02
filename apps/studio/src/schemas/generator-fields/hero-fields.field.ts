import { defineField, type FieldDefinition } from "sanity";

import { datetimeField } from "@/schemas/generator-fields/datetime.field";
import { type MediaFieldOptions, mediaField } from "@/schemas/generator-fields/media.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { linksField } from "./links.field";
import { portableTextField } from "./portable-text/portable-text.field";
import { referenceField } from "./reference.field";

export const heroFields = (options?: {
  includePublishDate?: boolean;
  multipleCoverImages?: boolean;
  includeAuthor?: boolean;
  isStatic?: boolean;
  includeExcerpt?: boolean;
  includeCoverImage?: boolean;
  includeLinks?: boolean;
  /** Language suffix for field-level i18n (e.g., "_no" or "_en") */
  suffix?: string;
  /** Override the default group assignment */
  group?: string;
  /** Options to pass through to the media field */
  mediaOptions?: Omit<MediaFieldOptions, "name" | "title" | "group">;
}): FieldDefinition[] => {
  const {
    includePublishDate = false,
    multipleCoverImages = false,
    includeAuthor = false,
    isStatic = false,
    includeExcerpt = false,
    includeCoverImage = true,
    includeLinks = false,
    suffix = "",
    group = "key",
    mediaOptions = {},
  } = options ?? {};

  return [
    stringField({
      name: `title${suffix}`,
      title: "Title",
      required: true,
      group,
    }),
    // Only include slug if no suffix (slug is language-independent)
    ...(suffix ? [] : [slugField({ isStatic })]),
    ...(includeExcerpt
      ? [
          portableTextField({
            title: "Excerpt",
            name: `excerpt${suffix}`,
            group,
            noContent: true,
            includeLists: true,
          }),
        ]
      : []),
    ...(includePublishDate
      ? [
          datetimeField({
            name: `publishDate${suffix}`,
            title: "Publish date",
            group,
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
              name: `coverImages${suffix}`,
              type: "array",
              of: [
                mediaField({
                  name: "media",
                  title: "Main images/videos",
                  video: true,
                  ...mediaOptions,
                }),
              ],
              group,
              validation: (Rule) =>
                Rule.min(1)
                  .max(3)
                  .error("At least one cover image is required and at most three are allowed"),
            }),
          ]
        : [
            mediaField({
              name: `media${suffix}`,
              title: "Main image/video",
              group,
              video: true,
              ...mediaOptions,
            }),
          ]
      : []),
    ...(includeAuthor
      ? [
          referenceField({
            title: "Author",
            name: `author${suffix}`,
            to: [{ type: "person" }],
            group,
          }),
        ]
      : []),
    ...(includeLinks
      ? [
          linksField({
            title: "Links",
            name: `links${suffix}`,
            includeExternal: true,
            includeDownload: true,
            max: 2,
            group,
          }),
        ]
      : []),
  ];
};
