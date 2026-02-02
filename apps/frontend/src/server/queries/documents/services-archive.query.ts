import { defineQuery } from "next-sanity";
import { heroQuery } from "../utils/hero.query";
import { imageQuery } from "../utils/image.query";

export const servicesArchiveSettingsQuery = defineQuery(`
  *[_type == "servicesArchive"][0] {
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

export const servicesListQuery = defineQuery(`
  *[_type == "service" && select(
    $locale == "no" => defined(title_no) && defined(slug_no.current),
    $locale == "en" => defined(title_en) && defined(slug_en.current)
  )] | order(title_no asc) {
    _id,
    _type,
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "slug": select(
      $locale == "no" => slug_no.current,
      $locale == "en" => slug_en.current
    ),
    "excerpt": select(
      $locale == "no" => excerpt_no,
      $locale == "en" => excerpt_en
    ),
    "media": {
      "mediaType": media.mediaType,
      "image": media.image { ${imageQuery} },
      "illustration": media.illustration
    },
    "technologies": technologies[]-> {
      _id,
      title,
      "logo": logo->logo.asset->url
    }
  }
`);
