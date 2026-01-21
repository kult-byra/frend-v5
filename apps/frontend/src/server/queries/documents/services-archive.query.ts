import { defineQuery } from "next-sanity";
import { imageQuery } from "../utils/image.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const servicesArchiveSettingsQuery = defineQuery(`
  *[_type == "servicesArchive" && language == $locale][0] {
    title,
    subtitle,
    excerpt,
    ${metadataQuery},
    ${translationsQuery}
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
    }
  }
`);
