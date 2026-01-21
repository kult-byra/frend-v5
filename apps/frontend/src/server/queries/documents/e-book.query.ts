import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const eBookArchiveSettingsQuery = defineQuery(`
  *[_type == "eBookArchive" && language == $locale][0] {
    title,
    subtitle,
    ${metadataQuery},
    ${translationsQuery}
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
