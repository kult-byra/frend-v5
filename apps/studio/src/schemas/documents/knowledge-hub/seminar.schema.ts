import { Video } from "lucide-react";
import { defineField, defineType } from "sanity";
import { booleanField } from "@/schemas/generator-fields/boolean.field";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { articleHeroField } from "@/schemas/generator-fields/hero.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const seminarSchema = defineType({
  name: "seminar",
  title: "Seminar",
  type: "document",
  icon: Video,
  groups: defaultGroups,
  options: {
    linkable: true,
  },
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    slugField({ isStatic: false }),
    articleHeroField({
      group: "key",
      useExcerpt: true,
      useMedia: 1,
    }),
    referenceField({
      title: "Client",
      name: "client",
      to: [{ type: "client" }],
      group: "key",
    }),
    referenceField({
      title: "Signup form",
      name: "signupForm",
      to: [{ type: "hubspotForm" }],
      group: "key",
      validation: (Rule) => Rule.required().error("Signup form is required"),
    }),
    booleanField({
      title: "Is flagship model seminar",
      name: "isFlagshipModelSeminar",
      group: "key",
      initialValue: false,
    }),
    ...connectionsFields(),
    portableTextWithBlocksField({
      group: "content",
      includeLists: true,
      includeHeadings: true,
    }),
    metadataField(),
  ],
  preview: {
    select: {
      title: "hero.title",
      media: "hero.media.0.image.asset",
    },
    prepare({ title, media }) {
      return {
        title: title || "Untitled",
        media,
      };
    },
  },
});
