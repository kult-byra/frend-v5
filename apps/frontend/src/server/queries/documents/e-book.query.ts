import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const eBookArchiveSettingsQuery = defineQuery(`
  *[_type == "eBookArchive"][0] {
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

export const eBookListQuery = defineQuery(`
  *[_type == "eBook" && language == $locale] | order(_createdAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    subtitle
  }
`);

export const eBookQuery = defineQuery(`
  *[_type == "eBook" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    uploadFile,
    ${fullPortableTextQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const eBookSlugsQuery = defineQuery(`
  *[_type == "eBook"] {
    "slug": slug.current,
    "locale": language
  }
`);
