import { defineQuery } from "next-sanity";
import type { NewsTeaserProps } from "../teasers/news-teaser.query";
import { newsTeaserQuery } from "../teasers/news-teaser.query";

// Query for news archive with filtering
// @sanity-typegen-ignore
export const newsArchiveQuery = defineQuery(`*[
  _type == "newsArticle"
  && hero.publishDate < now()
  && language == $locale
  && (!defined($service) || $service in services[]->slug.current)
  && (!defined($technologies) || count((technologies[]._ref)[@ in $technologies]) > 0)
  && (!defined($industries) || count((industries[]._ref)[@ in $industries]) > 0)
] | order(hero.publishDate desc) {
  ${newsTeaserQuery}
}`);

export type NewsArchiveResult = NewsTeaserProps[];

// Query for services (same as knowledge hub)
export const newsArchiveServicesQuery = defineQuery(`
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

// Query for technologies
export const newsArchiveTechnologiesQuery = defineQuery(`
  *[_type == "technology" && defined(title)] | order(title asc) {
    _id,
    title
  }
`);

// Query for industries
export const newsArchiveIndustriesQuery = defineQuery(`
  *[_type == "industry" && defined(title)] | order(title asc) {
    _id,
    title
  }
`);

// Query for news archive page settings (title, metadata)
export const newsArchiveSettingsQuery = defineQuery(`
  *[_type == "newsAndEventsArchive"][0] {
    "hero": select(
      $locale == "no" => hero_no {
        heroType,
        textHero { title, excerpt, links },
        mediaHero { title, media, excerpt, links }
      },
      $locale == "en" => hero_en {
        heroType,
        textHero { title, excerpt, links },
        mediaHero { title, media, excerpt, links }
      }
    ),
    "metadata": select(
      $locale == "no" => {
        "title": coalesce(metadata_no.title, hero_no.textHero.title, hero_no.mediaHero.title),
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
        "title": coalesce(metadata_en.title, hero_en.textHero.title, hero_en.mediaHero.title),
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
