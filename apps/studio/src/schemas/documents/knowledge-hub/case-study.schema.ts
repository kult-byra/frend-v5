import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";
import { colorField } from "@/schemas/generator-fields/color.field";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
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
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      group: "key",
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
      colors: ["white", "navy", "orange"],
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
    pageBuilderField({
      group: "content",
    }),
    metadataField(),
  ],
  preview: {
    select: {
      heroType: "hero.heroType",
      textTitle: "hero.textHero.title",
      mediaTitle: "hero.mediaHero.title",
      articleTitle: "hero.articleHero.title",
      mediaImage: "hero.mediaHero.media.image.asset",
      articleImage: "hero.articleHero.coverImages.0.image.asset",
    },
    prepare({ heroType, textTitle, mediaTitle, articleTitle, mediaImage, articleImage }) {
      const titleMap: Record<string, string | undefined> = {
        textHero: textTitle,
        mediaHero: mediaTitle,
        articleHero: articleTitle,
      };
      const mediaMap: Record<string, typeof mediaImage> = {
        mediaHero: mediaImage,
        articleHero: articleImage,
      };
      return {
        title: titleMap[heroType] || "Untitled",
        media: mediaMap[heroType],
      };
    },
  },
});
