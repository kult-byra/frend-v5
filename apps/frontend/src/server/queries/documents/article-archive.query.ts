import { defineQuery } from "next-sanity";
import type { ArticleTeaserProps } from "../teasers/article-teaser.query";
import { articleTeaserQuery } from "../teasers/article-teaser.query";

// Query for article archive page settings (title, metadata)
export const articleArchiveSettingsQuery = defineQuery(`
  *[_type == "newsAndEventsArchive"][0] {
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "metadata": select(
      $locale == "no" => {
        "title": coalesce(metadata_no.title, title_no),
        "desc": metadata_no.desc,
        "image": select(
          defined(metadata_no.image.asset._ref) => metadata_no.image {
            "id": asset._ref,
            altText
          }
        ),
        "tags": metadata_no.tags,
        "noIndex": metadata_no.noIndex
      },
      $locale == "en" => {
        "title": coalesce(metadata_en.title, title_en),
        "desc": metadata_en.desc,
        "image": select(
          defined(metadata_en.image.asset._ref) => metadata_en.image {
            "id": asset._ref,
            altText
          }
        ),
        "tags": metadata_en.tags,
        "noIndex": metadata_en.noIndex
      }
    )
  }
`);

// Query for paginated articles - nested subquery, use ArticleArchivePaginatedResult
// @sanity-typegen-ignore
export const articleArchivePaginatedQuery = defineQuery(`{
  "articles": *[_type == "newsArticle" && hero.publishDate < now() && language == $locale] | order(hero.publishDate desc) [$start...$end] {
    ${articleTeaserQuery}
  },
  "total": count(*[_type == "newsArticle" && hero.publishDate < now() && language == $locale])
}`);

// Type derived from ArticleTeaserProps (which is generated via typegen in article-teaser.query.ts)
export type ArticleArchivePaginatedResult = {
  articles: ArticleTeaserProps[];
  total: number;
};

// Legacy query for backwards compatibility
export const articleArchiveQuery = defineQuery(`
  *[_type == "newsAndEventsArchive"][0] {
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "articles": *[_type == "newsArticle" && hero.publishDate < now() && language == $locale] | order(hero.publishDate desc) {
      ${articleTeaserQuery}
    },
    "metadata": select(
      $locale == "no" => {
        "title": coalesce(metadata_no.title, title_no),
        "desc": metadata_no.desc,
        "image": select(
          defined(metadata_no.image.asset._ref) => metadata_no.image {
            "id": asset._ref,
            altText
          }
        ),
        "tags": metadata_no.tags,
        "noIndex": metadata_no.noIndex
      },
      $locale == "en" => {
        "title": coalesce(metadata_en.title, title_en),
        "desc": metadata_en.desc,
        "image": select(
          defined(metadata_en.image.asset._ref) => metadata_en.image {
            "id": asset._ref,
            altText
          }
        ),
        "tags": metadata_en.tags,
        "noIndex": metadata_en.noIndex
      }
    )
  }
`);
