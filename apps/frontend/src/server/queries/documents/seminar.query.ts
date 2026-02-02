import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { heroQuery } from "../utils/hero.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const seminarArchiveSettingsQuery = defineQuery(`
  *[_type == "seminarArchive"][0] {
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

export const seminarListQuery = defineQuery(`
  *[_type == "seminar" && language == $locale] | order(_createdAt desc) {
    _id,
    _type,
    "title": coalesce(hero.textHero.title, hero.mediaHero.title, hero.articleHero.title),
    "slug": slug.current,
    "excerpt": hero.textHero.excerpt
  }
`);

export const seminarQuery = defineQuery(`
  *[_type == "seminar" && slug.current == $slug && language == $locale][0] {
    _id,
    hero { ${heroQuery} },
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
