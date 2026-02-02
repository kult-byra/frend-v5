import { defineQuery } from "next-sanity";
import type { NewsTeaserTypegenQueryResult } from "@/sanity-types";
import { imageQuery } from "../utils/image.query";

// @sanity-typegen-ignore
export const newsTeaserQuery = defineQuery(`
  _id,
  _type,
  "title": coalesce(hero.textHero.title, hero.mediaHero.title, hero.articleHero.title),
  "slug": slug.current,
  "image": coalesce(
    hero.mediaHero.media.image,
    hero.articleHero.media.image
  ) {
    ${imageQuery}
  },
  "publishDate": hero.articleHero.publishDate,
  "services": services[]->{
    _id,
    "title": coalesce(title_no, title_en)
  },
  "technologies": technologies[]->{
    _id,
    title
  },
  "industries": industries[]->{
    _id,
    title
  }
`);

// For typegen
const _newsTeaserTypegenQuery = defineQuery(`
  *[_type == "newsArticle"][0]{
    ${newsTeaserQuery}
  }
`);

export type NewsTeaserProps = NonNullable<NewsTeaserTypegenQueryResult>;
