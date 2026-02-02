import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";
import { linksQuery } from "../utils/links.query";

// Helper for service/subService fields with language selection
// @sanity-typegen-ignore
const serviceFieldsQuery = `
  _id,
  _type,
  "title": select(
    _type in ["service", "subService"] => select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    title
  ),
  "slug": select(
    _type in ["service", "subService"] => select(
      $locale == "no" => slug_no.current,
      $locale == "en" => slug_en.current
    ),
    slug.current
  ),
  "excerpt": select(
    _type in ["service", "subService"] => select(
      $locale == "no" => excerpt_no,
      $locale == "en" => excerpt_en
    ),
    excerpt
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
`;

// Helper for knowledge items (knowledgeArticle, caseStudy, seminar, eBook)
// @sanity-typegen-ignore
const knowledgeFieldsQuery = `
  _id,
  _type,
  "title": coalesce(hero.textHero.title, hero.mediaHero.title, hero.articleHero.title),
  "slug": slug.current,
  "image": coalesce(
    hero.mediaHero.media.image,
    hero.articleHero.coverImages[0].image
  ) { ${imageQuery} },
  "services": services[]-> {
    _id,
    "title": select(
      ^.language == "no" => title_no,
      ^.language == "en" => title_en
    )
  }
`;

// Helper for news & events items (newsArticle, event) - uses same teaser structure as knowledge
// @sanity-typegen-ignore
const newsEventFieldsQuery = `
  _id,
  _type,
  "title": coalesce(hero.textHero.title, hero.mediaHero.title, hero.articleHero.title),
  "slug": slug.current,
  "image": coalesce(
    hero.mediaHero.media.image,
    hero.articleHero.coverImages[0].image
  ) { ${imageQuery} },
  "services": services[]-> {
    _id,
    "title": select(
      ^.language == "no" => title_no,
      ^.language == "en" => title_en
    )
  }
`;

// @sanity-typegen-ignore
export const cardsBlockQuery = defineQuery(`
  _type,
  _key,
  heading,
  "featuredLabel": *[_type == "stringTranslations"][0].featured[_key == $locale][0].value,
  "seeAllLabel": *[_type == "stringTranslations"][0].seeAll[_key == $locale][0].value,
  "noContentFoundLabel": *[_type == "stringTranslations"][0].noContentFound[_key == $locale][0].value,
  "typeLabels": {
    "knowledgeArticle": *[_type == "stringTranslations"][0].labelArticle[_key == $locale][0].value,
    "caseStudy": *[_type == "stringTranslations"][0].labelCaseStudy[_key == $locale][0].value,
    "seminar": *[_type == "stringTranslations"][0].labelSeminar[_key == $locale][0].value,
    "eBook": *[_type == "stringTranslations"][0].labelEBook[_key == $locale][0].value,
    "newsArticle": *[_type == "stringTranslations"][0].labelNews[_key == $locale][0].value,
    "event": *[_type == "stringTranslations"][0].labelEvent[_key == $locale][0].value
  },
  "content": excerpt[] {
    _key,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  },
  contentType,
  knowledgeTypes,
  newsEventTypes,
  manualSelection,
  links[] {
    ${linksQuery}
  },
  "allIndustries": select(
    contentType == "client" && manualSelection == true => array::unique(manualClientDocuments[]->industries[]->title),
    contentType == "client" => array::unique(*[_type == "client"].industries[]->title),
    null
  ),
  "items": select(
    contentType == "services" && manualSelection == true => manualServiceDocuments[]-> {
      ${serviceFieldsQuery}
    },
    contentType == "knowledge" && manualSelection == true => manualKnowledgeDocuments[]-> {
      ${knowledgeFieldsQuery}
    },
    contentType == "newsEvents" && manualSelection == true => manualNewsEventDocuments[]-> {
      ${newsEventFieldsQuery}
    },
    contentType == "client" && manualSelection == true => manualClientDocuments[]-> {
      _id,
      _type,
      "title": name,
      "slug": slug.current,
      "logo": logo->logo.asset->url,
      "description": pt::text(description),
      "industries": industries[]->title
    },
    contentType == "services" => *[_type == "service" && select(
      $locale == "no" => defined(title_no) && defined(slug_no.current),
      $locale == "en" => defined(title_en) && defined(slug_en.current)
    )] | order(_createdAt desc) {
      ${serviceFieldsQuery}
    },
    contentType == "knowledge" => *[
      _type in ^.knowledgeTypes
      && language == $locale
    ] | order(coalesce(publishDate, _createdAt) desc) {
      ${knowledgeFieldsQuery}
    },
    contentType == "newsEvents" => *[
      _type in ^.newsEventTypes
      && language == $locale
    ] | order(coalesce(publishDate, _createdAt) desc) {
      ${newsEventFieldsQuery}
    },
    contentType == "client" => *[_type == "client"] | order(_createdAt desc) {
      _id,
      _type,
      "title": name,
      "slug": slug.current,
      "logo": logo->logo.asset->url,
      "description": pt::text(description),
      "industries": industries[]->title
    }
  ),
  options { width }
`);
