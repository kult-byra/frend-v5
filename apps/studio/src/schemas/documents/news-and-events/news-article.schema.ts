import { Newspaper } from "lucide-react";
import { defineField, defineType } from "sanity";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { heroField } from "@/schemas/generator-fields/hero.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
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
    slugField({ isStatic: false }),
    heroField({
      name: "hero",
      title: "Hero",
      types: ["articleHero"],
      group: "key",
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
      title: "hero.articleHero.title",
      media: "hero.articleHero.coverImages.0.image.asset",
      authorName: "hero.articleHero.author.name",
    },
    prepare({ title, media, authorName }) {
      return {
        title: title || "Untitled",
        subtitle: authorName,
        media,
      };
    },
  },
});
