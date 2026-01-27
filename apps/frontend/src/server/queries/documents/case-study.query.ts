import { defineQuery } from "next-sanity";
import { pageBuilderQuery } from "@/server/queries/page-builder/page-builder-full.query";
import { nestedMediaQuery } from "../utils/media.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const caseStudyArchiveSettingsQuery = defineQuery(`
  *[_type == "caseStudyArchive"][0] {
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

export const caseStudyListQuery = defineQuery(`
  *[_type == "caseStudy" && language == $locale] | order(_createdAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    "client": client->{
      name,
      "logo": logo->image.asset->url
    },
    color
  }
`);

export const caseStudyQuery = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    "client": client->{
      _id,
      name,
      "logo": logo->image.asset->url
    },
    color,
    "media": {
      ${nestedMediaQuery("media")}
    },
    summary,
    ${pageBuilderQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const caseStudySlugsQuery = defineQuery(`
  *[_type == "caseStudy"] {
    "slug": slug.current,
    "locale": language
  }
`);
