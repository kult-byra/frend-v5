import { defineQuery } from "next-sanity";
import { heroQuery } from "../utils/hero.query";
import { imageQuery } from "../utils/image.query";

export const knowledgeHubSettingsQuery = defineQuery(`
  *[_type == "knowledgeHub"][0] {
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

// Shared knowledge teaser fields for all content types
// @sanity-typegen-ignore
const knowledgeTeaserFields = `
  _id,
  _type,
  "title": coalesce(hero.textHero.title, hero.mediaHero.title, hero.articleHero.title),
  "slug": slug.current,
  "publishDate": coalesce(hero.articleHero.publishDate, _createdAt),
  "image": coalesce(
    hero.mediaHero.media.image,
    hero.articleHero.coverImages[0].image
  ) {
    ${imageQuery}
  },
  "services": services[]-> {
    _id,
    "title": select(
      ^.language == "no" => title_no,
      ^.language == "en" => title_en
    )
  },
  "technologies": technologies[]-> {
    _id,
    title
  },
  "industries": industries[]-> {
    _id,
    title
  }
`;

// Get all knowledge content combined and sorted
export const knowledgeHubContentQuery = defineQuery(`
  *[
    _type in ["knowledgeArticle", "caseStudy", "seminar", "eBook"]
    && language == $locale
  ] | order(coalesce(publishDate, _createdAt) desc) {
    ${knowledgeTeaserFields}
  }
`);

// Get all services for filter pills
export const knowledgeHubServicesQuery = defineQuery(`
  *[_type == "service" && select(
    $locale == "no" => defined(title_no),
    $locale == "en" => defined(title_en)
  )] | order(select(
    $locale == "no" => title_no,
    $locale == "en" => title_en
  ) asc) {
    _id,
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "slug": select(
      $locale == "no" => slug_no.current,
      $locale == "en" => slug_en.current
    )
  }
`);

// Get all technologies for filter dialog
export const knowledgeHubTechnologiesQuery = defineQuery(`
  *[_type == "technology" && defined(title)] | order(title asc) {
    _id,
    title
  }
`);

// Get all industries for filter dialog
export const knowledgeHubIndustriesQuery = defineQuery(`
  *[_type == "industry" && defined(title)] | order(title asc) {
    _id,
    title
  }
`);

// Content type specific archive queries
export const caseStudyArchiveContentQuery = defineQuery(`
  *[
    _type == "caseStudy"
    && language == $locale
  ] | order(coalesce(publishDate, _createdAt) desc) {
    ${knowledgeTeaserFields}
  }
`);

export const seminarArchiveContentQuery = defineQuery(`
  *[
    _type == "seminar"
    && language == $locale
  ] | order(coalesce(publishDate, _createdAt) desc) {
    ${knowledgeTeaserFields}
  }
`);

export const eBookArchiveContentQuery = defineQuery(`
  *[
    _type == "eBook"
    && language == $locale
  ] | order(coalesce(publishDate, _createdAt) desc) {
    ${knowledgeTeaserFields}
  }
`);

export const knowledgeArticleArchiveContentQuery = defineQuery(`
  *[
    _type == "knowledgeArticle"
    && language == $locale
  ] | order(coalesce(publishDate, _createdAt) desc) {
    ${knowledgeTeaserFields}
  }
`);
