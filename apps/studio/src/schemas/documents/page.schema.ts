import { LayoutPanelTop } from "lucide-react";
import { defineField, defineType } from "sanity";

import { heroField } from "@/schemas/generator-fields/hero.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const pageSchema = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: LayoutPanelTop,
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
      types: ["articleHero", "mediaHero", "stickyHero"],
      group: "key",
    }),
    pageBuilderField({
      group: "content",
    }),
    metadataField(),
  ],
  preview: {
    select: {
      heroType: "hero.heroType",
      mediaTitle: "hero.mediaHero.title",
      articleTitle: "hero.articleHero.title",
      stickyTitle: "hero.stickyHero.title",
      mediaImage: "hero.mediaHero.media.image.asset",
      articleImage: "hero.articleHero.coverImages.0.image.asset",
      stickyImage: "hero.stickyHero.media.image.asset",
    },
    prepare({
      heroType,
      mediaTitle,
      articleTitle,
      stickyTitle,
      mediaImage,
      articleImage,
      stickyImage,
    }) {
      const titleMap: Record<string, string | undefined> = {
        mediaHero: mediaTitle,
        articleHero: articleTitle,
        stickyHero: stickyTitle,
      };
      const mediaMap: Record<string, typeof mediaImage> = {
        mediaHero: mediaImage,
        articleHero: articleImage,
        stickyHero: stickyImage,
      };
      return {
        title: titleMap[heroType] || "Untitled",
        media: mediaMap[heroType],
      };
    },
  },
});
