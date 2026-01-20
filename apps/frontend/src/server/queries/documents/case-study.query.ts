import { defineQuery } from "next-sanity";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";
import { pageBuilderQuery } from "@/server/queries/page-builder/page-builder-full.query";

export const caseStudyArchiveSettingsQuery = defineQuery(`
  *[_type == "caseStudyArchive" && language == $locale][0] {
    title,
    subtitle,
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const caseStudyListQuery = defineQuery(`
  *[_type == "caseStudy" && language == $locale] | order(_createdAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    "client": client->{
      name,
      "logo": logo->image.asset->url
    },
    color
  }
`);

export const caseStudyQuery = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    "client": client->{
      _id,
      name,
      "logo": logo->image.asset->url
    },
    color,
    summary,
    keyResults,
    ${pageBuilderQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const caseStudySlugsQuery = defineQuery(`
  *[_type == "caseStudy"] {
    "slug": slug.current,
    "locale": language
  }
`);
