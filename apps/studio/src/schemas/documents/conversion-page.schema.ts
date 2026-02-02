import { Phone } from "lucide-react";
import { defineField, defineType } from "sanity";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { referenceField } from "../generator-fields/reference.field";

export const conversionPageSchema = defineType({
  name: "conversionPage",
  title: "Conversion page",
  type: "document",
  icon: Phone,
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
      title: "Contact form",
      name: "contactForm",
      to: [{ type: "hubspotForm" }],
      group: "key",
    }),
    referenceField({
      title: "Highlighted clients",
      name: "highlightedClients",
      to: [{ type: "client" }],
      group: "content",
      allowMultiple: true,
      max: 5,
    }),
    referenceField({
      title: "Highlighted quotes",
      name: "highlightedQuotes",
      to: [{ type: "quote" }],
      group: "content",
      allowMultiple: true,
    }),
    pageBuilderField({
      group: "content",
    }),
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
