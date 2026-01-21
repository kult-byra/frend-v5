import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { imageQuery } from "../utils/image.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const serviceQuery = defineQuery(`
  *[_type == "service" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    subtitle,
    excerpt,
    "slug": slug.current,
    "media": {
      "mediaType": media.mediaType,
      "image": media.image { ${imageQuery} },
      "illustration": media.illustration
    },
    subServicesDescription,
    "subServices": *[_type == "subService" && references(^._id) && language == $locale] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "media": {
        "mediaType": media.mediaType,
        "image": media.image { ${imageQuery} },
        "illustration": media.illustration
      }
    },
    ${fullPortableTextQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const serviceSlugsQuery = defineQuery(`
  *[_type == "service"] {
    "slug": slug.current,
    "locale": language
  }
`);
