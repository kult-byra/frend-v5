import { defineQuery } from "next-sanity";
import type { ArticleTeaserProps } from "../teasers/article-teaser.query";
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

// Query for paginated articles - nested subquery, use ArticleArchivePaginatedResult
// @sanity-typegen-ignore
export const articleArchivePaginatedQuery = defineQuery(`{
  "articles": *[_type == "newsArticle" && publishDate < now() && language == $locale] | order(publishDate desc) [$start...$end] {
    ${articleTeaserQuery}
  },
  "total": count(*[_type == "newsArticle" && publishDate < now() && language == $locale])
}`);

// Type derived from ArticleTeaserProps (which is generated via typegen in article-teaser.query.ts)
export type ArticleArchivePaginatedResult = {
  articles: ArticleTeaserProps[];
  total: number;
};

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
