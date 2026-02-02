import { defineQuery } from "next-sanity";
import { imageQuery } from "../utils/image.query";

export const servicesArchiveSettingsQuery = defineQuery(`
  *[_type == "servicesArchive"][0] {
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "excerpt": select(
      $locale == "no" => excerpt_no,
      $locale == "en" => excerpt_en
    ),
    "media": select(
      $locale == "no" => {
        "mediaType": media_no.mediaType,
        "image": media_no.image { ${imageQuery} },
        "videoUrl": media_no.videoUrl
      },
      $locale == "en" => {
        "mediaType": media_en.mediaType,
        "image": media_en.image { ${imageQuery} },
        "videoUrl": media_en.videoUrl
      }
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

export const servicesListQuery = defineQuery(`
  *[_type == "service" && select(
    $locale == "no" => defined(title_no) && defined(slug_no.current),
    $locale == "en" => defined(title_en) && defined(slug_en.current)
  )] | order(title_no asc) {
    _id,
    _type,
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "slug": select(
      $locale == "no" => slug_no.current,
      $locale == "en" => slug_en.current
    ),
    "excerpt": select(
      $locale == "no" => excerpt_no,
      $locale == "en" => excerpt_en
    ),
    "media": {
      "mediaType": media.mediaType,
      "image": media.image { ${imageQuery} },
      "illustration": media.illustration
    },
    "technologies": technologies[]-> {
      _id,
      title,
      "logo": logo->logo.asset->url
    }
  }
`);
