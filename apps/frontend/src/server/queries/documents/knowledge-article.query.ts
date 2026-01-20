import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const knowledgeArticleQuery = defineQuery(`
  *[_type == "knowledgeArticle" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    subtitle,
    publishDate,
    "author": author->{
      _id,
      name,
      "image": image.asset->url
    },
    summary,
    ${fullPortableTextQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const knowledgeArticleSlugsQuery = defineQuery(`
  *[_type == "knowledgeArticle"] {
    "slug": slug.current,
    "locale": language
  }
`);

export const knowledgeArticleArchiveSettingsQuery = defineQuery(`
  *[_type == "knowledgeArticleArchive" && language == $locale][0] {
    title,
    subtitle,
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const knowledgeArticleListQuery = defineQuery(`
  *[_type == "knowledgeArticle" && language == $locale] | order(publishDate desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    publishDate,
    "author": author->{
      name
    }
  }
`);
