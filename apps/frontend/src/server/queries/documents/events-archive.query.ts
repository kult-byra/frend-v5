import { defineQuery } from "next-sanity";
import type { EventTeaserProps } from "../teasers/event-teaser.query";
import { eventTeaserQuery } from "../teasers/event-teaser.query";

// Query for events archive with filtering
// @santml:typegen-ignore
export const eventsArchiveQuery = defineQuery(`*[
  _type == "event"
  && language == $locale
  && (!defined($service) || $service in services[]->slug.current)
  && (!defined($technologies) || count((technologies[]._ref)[@ in $technologies]) > 0)
  && (!defined($industries) || count((industries[]._ref)[@ in $industries]) > 0)
] | order(timeAndDate.startTime desc) {
  ${eventTeaserQuery}
}`);

export type EventsArchiveResult = EventTeaserProps[];

// Query for services (same as knowledge hub)
export const eventsArchiveServicesQuery = defineQuery(`
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
export const eventsArchiveTechnologiesQuery = defineQuery(`
  *[_type == "technology" && defined(title)] | order(title asc) {
    _id,
    title
  }
`);

// Query for industries
export const eventsArchiveIndustriesQuery = defineQuery(`
  *[_type == "industry" && defined(title)] | order(title asc) {
    _id,
    title
  }
`);

// Query for events archive page settings (title, metadata)
export const eventsArchiveSettingsQuery = defineQuery(`
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
