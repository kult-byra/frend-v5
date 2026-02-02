import { Newspaper } from "lucide-react";
import { defineField, defineType } from "sanity";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const newsArticleSchema = defineType({
  name: "newsArticle",
  title: "News article",
  type: "document",
  icon: Newspaper,
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
    ...heroFields({
      includePublishDate: true,
      multipleCoverImages: false,
      includeAuthor: true,
    }),
    ...connectionsFields(),
    portableTextWithBlocksField({
      group: "content",
      includeLists: true,
      includeHeadings: true,
    }),
    metadataField(),
  ],
});
