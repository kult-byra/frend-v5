import { defineQuery } from "next-sanity";
import type { _articleTeaserTypegenQueryResult } from "@/sanity-types";

// @sanity-typegen-ignore
export const articleTeaserQuery = defineQuery(`
  _id,
  _type,
  title,
  "slug": slug.current,
`);

// For typegen
const _articleTeaserTypegenQuery = defineQuery(`
    *[_type == "article"][0]{
      ${articleTeaserQuery}
    }
  `);

export type ArticleTeaserProps = NonNullable<_articleTeaserTypegenQueryResult>;
