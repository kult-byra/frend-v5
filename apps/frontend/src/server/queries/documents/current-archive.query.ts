import { defineQuery } from "next-sanity";
import type { EventTeaserProps } from "../teasers/event-teaser.query";
import { eventTeaserQuery } from "../teasers/event-teaser.query";
import type { NewsTeaserProps } from "../teasers/news-teaser.query";
import { newsTeaserQuery } from "../teasers/news-teaser.query";

// Query for services (same as knowledge hub)
export const currentArchiveServicesQuery = defineQuery(`
  *[_type == "service" && select(
    $locale == "no" => defined(title_no),
    $locale == "en" => defined(title_en)
  )] | order(select(
    $locale == "no" => title_no,
    $locale == "en" => title_en
  ) asc) {
    _id,
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "slug": select(
      $locale == "no" => slug_no.current,
      $locale == "en" => slug_en.current
    )
  }
`);

// Query for technologies (same as knowledge hub)
export const currentArchiveTechnologiesQuery = defineQuery(`
  *[_type == "technology" && defined(title)] | order(title asc) {
    _id,
    title
  }
`);

// Query for industries (same as knowledge hub)
export const currentArchiveIndustriesQuery = defineQuery(`
  *[_type == "industry" && defined(title)] | order(title asc) {
    _id,
    title
  }
`);

// Query for current archive page settings (title, metadata)
export const currentArchiveSettingsQuery = defineQuery(`
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

// Query for current archive content - nested subquery, use CurrentArchiveContentResult
// @sanity-typegen-ignore
export const currentArchiveContentQuery = defineQuery(`{
  "newsArticles": *[_type == "newsArticle" && publishDate < now() && language == $locale] | order(publishDate desc) {
    ${newsTeaserQuery}
  },
  "events": *[_type == "event" && language == $locale] | order(timeAndDate.startTime desc) {
    ${eventTeaserQuery}
  }
}`);

// Type derived from news and event teaser props (which are generated via typegen)
export type CurrentArchiveContentResult = {
  newsArticles: NewsTeaserProps[];
  events: EventTeaserProps[];
};
