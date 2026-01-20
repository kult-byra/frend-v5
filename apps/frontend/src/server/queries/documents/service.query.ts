import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const serviceQuery = defineQuery(`
  *[_type == "service" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    subtitle,
    excerpt,
    "slug": slug.current,
    "illustration": illustration->illustration.asset->url,
    subServicesDescription,
    "subServices": *[_type == "subService" && references(^._id) && language == $locale] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "illustration": illustration->illustration.asset->url
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
