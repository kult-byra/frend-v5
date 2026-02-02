import { defineQuery } from "next-sanity";
import { heroQuery } from "../utils/hero.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const clientArchiveSettingsQuery = defineQuery(`
  *[_type == "clientArchive"][0] {
    "hero": select(
      $locale == "no" => hero_no { ${heroQuery} },
      $locale == "en" => hero_en { ${heroQuery} }
    ),
    "metadata": select(
      $locale == "no" => {
        "title": coalesce(metadata_no.title, hero_no.textHero.title, hero_no.mediaHero.title),
        "desc": metadata_no.desc,
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
        "title": coalesce(metadata_en.title, hero_en.textHero.title, hero_en.mediaHero.title),
        "desc": metadata_en.desc,
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

export const clientListQuery = defineQuery(`
  *[_type == "client" && language == $locale] | order(name asc) {
    _id,
    _type,
    name,
    "logo": logo->logo.asset->url
  }
`);

export const clientCardsQuery = defineQuery(`
  *[_type == "client" && language == $locale] | order(name asc) {
    _id,
    _type,
    "title": name,
    "slug": name,
    "logo": logo->logo.asset->url,
    "industries": industries[]->title,
    "description": pt::text(description)
  }
`);

export const clientQuery = defineQuery(`
  *[_type == "client" && name == $name && language == $locale][0] {
    _id,
    name,
    "logo": logo->logo.asset->url,
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
