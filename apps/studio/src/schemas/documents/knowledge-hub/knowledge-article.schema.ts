import { Book } from "lucide-react";
import { defineField, defineType } from "sanity";

import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";

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
    ...heroFields({
      includePublishDate: true,
      includeAuthor: true,
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
});
