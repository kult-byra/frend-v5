import { defineQuery } from "next-sanity";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const knowledgeHubSettingsQuery = defineQuery(`
  *[_type == "knowledgeHub" && language == $locale][0] {
    title,
    subtitle,
    ${metadataQuery},
    ${translationsQuery}
  }
`);

// Get recent content from all knowledge hub types
export const knowledgeHubContentQuery = defineQuery(`{
  "articles": *[_type == "knowledgeArticle" && language == $locale] | order(publishDate desc) [0...6] {
    _id,
    _type,
    title,
    "slug": slug.current,
    publishDate
  },
  "caseStudies": *[_type == "caseStudy" && language == $locale] | order(_createdAt desc) [0...6] {
    _id,
    _type,
    title,
    "slug": slug.current
  },
  "seminars": *[_type == "seminar" && language == $locale] | order(_createdAt desc) [0...6] {
    _id,
    _type,
    title,
    "slug": slug.current
  },
  "eBooks": *[_type == "eBook" && language == $locale] | order(_createdAt desc) [0...6] {
    _id,
    _type,
    title,
    "slug": slug.current
  }
}`);
