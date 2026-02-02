import { Book } from "lucide-react";
import { defineField, defineType } from "sanity";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
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
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      group: "key",
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
      heroType: "hero.heroType",
      textTitle: "hero.textHero.title",
      mediaTitle: "hero.mediaHero.title",
      articleTitle: "hero.articleHero.title",
      formTitle: "hero.formHero.title",
      mediaImage: "hero.mediaHero.media.image.asset",
      articleImage: "hero.articleHero.coverImages.0.image.asset",
      formImage: "hero.formHero.media.image.asset",
    },
    prepare({
      heroType,
      textTitle,
      mediaTitle,
      articleTitle,
      formTitle,
      mediaImage,
      articleImage,
      formImage,
    }) {
      const titleMap: Record<string, string | undefined> = {
        textHero: textTitle,
        mediaHero: mediaTitle,
        articleHero: articleTitle,
        formHero: formTitle,
      };
      const mediaMap: Record<string, typeof mediaImage> = {
        mediaHero: mediaImage,
        articleHero: articleImage,
        formHero: formImage,
      };
      return {
        title: titleMap[heroType] || "Untitled",
        media: mediaMap[heroType],
      };
    },
  },
});
