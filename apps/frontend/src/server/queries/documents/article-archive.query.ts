import { defineQuery } from "next-sanity";
import { articleTeaserQuery } from "../teasers/article-teaser.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

// Query for article archive page settings (title, metadata)
export const articleArchiveSettingsQuery = defineQuery(`
  *[_type == "newsAndEventsArchive" && language == $locale][0] {
    title,
    ${metadataQuery},
    ${translationsQuery}
  }
`);

// Query for paginated articles
// Pass start and end indices directly (e.g., start=0, end=12 for first page)
export const articleArchivePaginatedQuery = defineQuery(`{
  "articles": *[_type == "newsArticle" && publishDate < now() && language == $locale] | order(publishDate desc) [$start...$end] {
    ${articleTeaserQuery}
  },
  "total": count(*[_type == "newsArticle" && publishDate < now() && language == $locale])
}`);

// Legacy query for backwards compatibility
export const articleArchiveQuery = defineQuery(`
  *[_type == "newsAndEventsArchive" && language == $locale][0] {
    title,
    "articles": *[_type == "newsArticle" && publishDate < now() && language == $locale] | order(publishDate desc) {
      ${articleTeaserQuery}
    },
    ${metadataQuery},
    ${translationsQuery}
  }
`);
