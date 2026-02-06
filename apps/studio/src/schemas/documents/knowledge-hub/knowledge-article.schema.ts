import { Book } from "lucide-react";
import { defineField, defineType } from "sanity";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { articleHeroField } from "@/schemas/generator-fields/hero.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const knowledgeArticleSchema = defineType({
  name: "knowledgeArticle",
  title: "Knowledge article",
  type: "document",
  icon: Book,
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
      useByline: true,
      useMedia: 1,
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
