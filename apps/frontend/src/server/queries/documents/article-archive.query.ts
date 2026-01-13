import { defineQuery } from "next-sanity";
import { articleTeaserQuery } from "../teasers/article-teaser.query";
import { metadataQuery } from "../utils/metadata.query";

// Query for article archive page settings (title, metadata)
export const articleArchiveSettingsQuery = defineQuery(`
  *[_type == "articleArchive"][0] {
    title,
    ${metadataQuery}
  }
`);

// Query for paginated articles
// Pass start and end indices directly (e.g., start=0, end=12 for first page)
export const articleArchivePaginatedQuery = defineQuery(`{
  "articles": *[_type == "article" && publishDate < now()] | order(publishDate desc) [$start...$end] {
    ${articleTeaserQuery}
  },
  "total": count(*[_type == "article" && publishDate < now()])
}`);

// Legacy query for backwards compatibility
export const articleArchiveQuery = defineQuery(`
  *[_type == "articleArchive"][0] {
    title,
    "articles": *[_type == "article" && publishDate < now()] | order(publishDate desc) {
      ${articleTeaserQuery}
    },
    ${metadataQuery}
  }
`);
