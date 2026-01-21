import { defineQuery } from "next-sanity";
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
  *[_type == "service" && language == $locale] | order(title asc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    "illustration": illustration->illustration.asset->url
  }
`);
