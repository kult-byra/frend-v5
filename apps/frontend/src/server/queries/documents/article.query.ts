import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const articleQuery = defineQuery(`
  *[_type == "newsArticle" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    ${fullPortableTextQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const articleSlugsQuery = defineQuery(`
  *[_type == "newsArticle" && language == $locale] {
    "slug": slug.current
  }
`);
