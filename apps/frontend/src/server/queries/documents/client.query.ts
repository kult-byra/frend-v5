import { defineQuery } from "next-sanity";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const clientArchiveSettingsQuery = defineQuery(`
  *[_type == "clientArchive"][0] {
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "excerpt": select(
      $locale == "no" => excerpt_no,
      $locale == "en" => excerpt_en
    ),
    "metadata": select(
      $locale == "no" => {
        "title": coalesce(metadata_no.title, title_no),
        "desc": coalesce(metadata_no.desc, excerpt_no),
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
        "desc": coalesce(metadata_en.desc, excerpt_en),
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

export const clientListQuery = defineQuery(`
  *[_type == "client" && language == $locale] | order(name asc) {
    _id,
    _type,
    name,
    "logo": logo->logo.asset->url
  }
`);

export const clientQuery = defineQuery(`
  *[_type == "client" && name == $name && language == $locale][0] {
    _id,
    name,
    "logo": logo->logo.asset->url,
    description,
    "caseStudies": *[_type == "caseStudy" && client._ref == ^._id && language == $locale] {
      _id,
      title,
      "slug": slug.current
    },
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const clientSlugsQuery = defineQuery(`
  *[_type == "client"] {
    "slug": name,
    "locale": language
  }
`);
