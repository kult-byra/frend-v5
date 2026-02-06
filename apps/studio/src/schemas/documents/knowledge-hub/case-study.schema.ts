import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";
import { colorField } from "@/schemas/generator-fields/color.field";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { articleHeroField } from "@/schemas/generator-fields/hero.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const caseStudySchema = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  icon: Star,
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
      useMedia: 1,
    }),
    referenceField({
      title: "Client",
      name: "client",
      to: [{ type: "client" }],
      group: "key",
    }),
    colorField({
      title: "Color",
      name: "color",
      group: "key",
      colors: ["white", "navy", "yellow"],
      initialValue: "white",
    }),
    ...connectionsFields(),
    portableTextField({
      title: "Summary",
      name: "summary",
      group: "content",
      includeLists: true,
      noContent: true,
    }),
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
