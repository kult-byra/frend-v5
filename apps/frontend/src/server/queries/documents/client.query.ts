import { defineQuery } from "next-sanity";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const clientArchiveSettingsQuery = defineQuery(`
  *[_type == "clientArchive" && language == $locale][0] {
    title,
    subtitle,
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const clientListQuery = defineQuery(`
  *[_type == "client" && language == $locale] | order(name asc) {
    _id,
    _type,
    name,
    "logo": logo->image.asset->url
  }
`);

export const clientQuery = defineQuery(`
  *[_type == "client" && name == $name && language == $locale][0] {
    _id,
    name,
    "logo": logo->image.asset->url,
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
