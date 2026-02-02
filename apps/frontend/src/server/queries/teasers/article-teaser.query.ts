import { defineQuery } from "next-sanity";
import type { ArticleTeaserTypegenQueryResult } from "@/sanity-types";

// @sanity-typegen-ignore
export const articleTeaserQuery = defineQuery(`
  _id,
  _type,
  "title": coalesce(hero.textHero.title, hero.mediaHero.title, hero.articleHero.title),
  "slug": slug.current,
`);

// For typegen
const _articleTeaserTypegenQuery = defineQuery(`
    *[_type == "newsArticle"][0]{
      _id,
      _type,
      "title": coalesce(hero.textHero.title, hero.mediaHero.title, hero.articleHero.title),
      "slug": slug.current
    }
  `);

export type ArticleTeaserProps = NonNullable<ArticleTeaserTypegenQueryResult>;
