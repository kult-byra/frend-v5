import { defineQuery } from "next-sanity";

import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { directArticleHeroQuery, heroQuery } from "../utils/hero.query";
import { imageQuery } from "../utils/image.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const caseStudyArchiveSettingsQuery = defineQuery(`
  *[_type == "caseStudyArchive"][0] {
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

export const caseStudyListQuery = defineQuery(`
  *[_type == "caseStudy" && language == $locale] | order(_createdAt desc) {
    _id,
    _type,
    "title": hero.title,
    "slug": slug.current,
    "image": hero.media[0].image {
      ${imageQuery}
    },
    "client": client->{
      name,
      "logo": logo->logo.asset->url
    },
    color
  }
`);

export const caseStudyQuery = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug && language == $locale][0] {
    _id,
    hero { ${directArticleHeroQuery} },
    "slug": slug.current,
    "client": client->{
      _id,
      name,
      "logo": logo->logo.asset->url
    },
    color,
    summary[] {
      _key,
      _type,
      _type == "block" => {
        ${portableTextInnerQuery}
      }
    },
    ${fullPortableTextQuery},
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
