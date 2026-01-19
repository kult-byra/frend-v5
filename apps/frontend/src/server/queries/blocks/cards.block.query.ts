import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";

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
  "items": select(
    contentType == "services" && manualSelection == true => manualServiceDocuments[]-> {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
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
    contentType == "services" => *[_type in ["service", "subService"]] | order(_createdAt desc) [0...6] {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "newsArticle" => *[_type == "newsArticle"] | order(_createdAt desc) [0...6] {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "caseStudy" => *[_type == "caseStudy"] | order(_createdAt desc) [0...6] {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "event" => *[_type == "event"] | order(_createdAt desc) [0...6] {
      _id,
      _type,
      title,
      "slug": slug.current,
      image { ${imageQuery} }
    },
    contentType == "client" => *[_type == "client"] | order(_createdAt desc) [0...6] {
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
