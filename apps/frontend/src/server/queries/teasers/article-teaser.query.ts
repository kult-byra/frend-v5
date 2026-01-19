import { defineQuery } from "next-sanity";
import type { ArticleTeaserTypegenQueryResult } from "@/sanity-types";

// @sanity-typegen-ignore
export const articleTeaserQuery = defineQuery(`
  _id,
  _type,
  title,
  "slug": slug.current,
`);

// For typegen
const _articleTeaserTypegenQuery = defineQuery(`
    *[_type == "newsArticle"][0]{
      ${articleTeaserQuery}
    }
  `);

export type ArticleTeaserProps = NonNullable<ArticleTeaserTypegenQueryResult>;
