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
  }
`;

// @sanity-typegen-ignore
export const cardsBlockQuery = defineQuery(`
  _type,
  _key,
  heading,
  "content": excerpt[] {
    _key,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  },
  contentType,
  manualSelection,
  links[] {
    ${linksQuery}
  },
  "items": select(
    contentType == "services" && manualSelection == true => manualServiceDocuments[]-> {
      ${serviceFieldsQuery}
    },
    contentType == "newsArticle" && manualSelection == true => manualNewsArticleDocuments[]-> {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "caseStudy" && manualSelection == true => manualCaseStudyDocuments[]-> {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "event" && manualSelection == true => manualEventDocuments[]-> {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "client" && manualSelection == true => manualClientDocuments[]-> {
      _id,
      _type,
      "title": name,
      "slug": slug.current,
      "image": logo->image { ${imageQuery} },
      "description": pt::text(description),
      "industries": industries[]->title
    },
    contentType == "services" => *[_type in ["service", "subService"] && select(
      $locale == "no" => defined(title_no) && defined(slug_no.current),
      $locale == "en" => defined(title_en) && defined(slug_en.current)
    )] | order(_createdAt desc) {
      ${serviceFieldsQuery}
    },
    contentType == "newsArticle" => *[_type == "newsArticle"] | order(_createdAt desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "caseStudy" => *[_type == "caseStudy"] | order(_createdAt desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "event" => *[_type == "event"] | order(_createdAt desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "client" => *[_type == "client"] | order(_createdAt desc) {
      _id,
      _type,
      "title": name,
      "slug": slug.current,
      "image": logo->image { ${imageQuery} },
      "description": pt::text(description),
      "industries": industries[]->title
    }
  )
`);
