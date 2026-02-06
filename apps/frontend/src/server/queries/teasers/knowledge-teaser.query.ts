import { defineQuery } from "next-sanity";
import type { KnowledgeTeaserTypegenQueryResult } from "@/sanity-types";
import { imageQuery } from "../utils/image.query";

// @sanity-typegen-ignore
// Knowledge types: knowledgeArticle, caseStudy, eBook, seminar
export const knowledgeTeaserQuery = defineQuery(`
  _id,
  _type,
  "title": hero.title,
  "slug": slug.current,
  "image": hero.media[0].image {
    ${imageQuery}
  },
  "services": services[]-> {
    _id,
    "title": select(
      ^.language == "no" => title_no,
      ^.language == "en" => title_en
    )
  }
`);

// For typegen - uses knowledgeArticle as base type since all knowledge types share same structure
const _knowledgeTeaserTypegenQuery = defineQuery(`
  *[_type == "knowledgeArticle"][0]{
    ${knowledgeTeaserQuery}
  }
`);

export type KnowledgeTeaserProps = NonNullable<KnowledgeTeaserTypegenQueryResult>;

export type KnowledgeContentType =
  | "knowledgeArticle"
  | "caseStudy"
  | "seminar"
  | "eBook"
  | "newsArticle"
  | "event";
