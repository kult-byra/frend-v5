import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const seminarArchiveSettingsQuery = defineQuery(`
  *[_type == "seminarArchive" && language == $locale][0] {
    title,
    subtitle,
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const seminarListQuery = defineQuery(`
  *[_type == "seminar" && language == $locale] | order(_createdAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt
  }
`);

export const seminarQuery = defineQuery(`
  *[_type == "seminar" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    subtitle,
    excerpt,
    "slug": slug.current,
    "client": client->{
      _id,
      name
    },
    isFlagshipModelSeminar,
    ${fullPortableTextQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const seminarSlugsQuery = defineQuery(`
  *[_type == "seminar"] {
    "slug": slug.current,
    "locale": language
  }
`);
