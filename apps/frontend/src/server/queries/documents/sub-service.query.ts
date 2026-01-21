import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { imageQuery } from "../utils/image.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const subServiceQuery = defineQuery(`
  *[_type == "subService" && slug.current == $slug && language == $locale][0] {
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
    "parentService": service->{
      _id,
      title,
      "slug": slug.current
    },
    ${fullPortableTextQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const subServiceSlugsQuery = defineQuery(`
  *[_type == "subService"] {
    "slug": service->slug.current,
    "subSlug": slug.current,
    "locale": language
  }
`);
