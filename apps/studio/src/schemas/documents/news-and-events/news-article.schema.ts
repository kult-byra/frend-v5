import { Newspaper } from "lucide-react";
import { defineField, defineType } from "sanity";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { articleHeroField } from "@/schemas/generator-fields/hero.field";
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
    articleHeroField({
      group: "key",
      useByline: true,
      useExcerpt: true,
      useMedia: 2,
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
      author0Name: "hero.byline.authors.0.name",
      author1Name: "hero.byline.authors.1.name",
      author2Name: "hero.byline.authors.2.name",
    },
    prepare({ title, media, author0Name, author1Name, author2Name }) {
      const names = [author0Name, author1Name, author2Name].filter(Boolean);
      return {
        title: title || "Untitled",
        subtitle: names.length > 0 ? names.join(", ") : undefined,
        media,
      };
    },
  },
});
