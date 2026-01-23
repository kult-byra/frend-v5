import { defineQuery } from "next-sanity";
import { imageQuery } from "../utils/image.query";

export const knowledgeHubSettingsQuery = defineQuery(`
  *[_type == "knowledgeHub"][0] {
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "metadata": select(
      $locale == "no" => {
        "title": coalesce(metadata_no.title, title_no),
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
        "title": coalesce(metadata_en.title, title_en),
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
  title,
  "slug": slug.current,
  "image": media.image {
    ${imageQuery}
  },
  "services": services[]-> {
    _id,
    "title": select(
      ^.language == "no" => title_no,
      ^.language == "en" => title_en
    )
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
