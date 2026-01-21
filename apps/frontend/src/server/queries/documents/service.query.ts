import { defineQuery } from "next-sanity";
import { callToActionBlockQuery } from "../blocks/call-to-action.block.query";
import { figureBlockQuery } from "../blocks/figure.block.query";
import { imageAndTextBlockQuery } from "../blocks/image-and-text.block.query";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";

// Helper for metadata with language suffix
// @sanity-typegen-ignore
const serviceMetadataQuery = (lang: string) => `
  "metadata": {
    "title": coalesce(metadata_${lang}.title, title_${lang}),
    "desc": coalesce(metadata_${lang}.desc, excerpt_${lang}),
    "image": select(
      defined(metadata_${lang}.image.asset._ref) => metadata_${lang}.image {
        "id": asset._ref,
        altText
      }
    ),
    "tags": metadata_${lang}.tags,
    "noIndex": metadata_${lang}.noIndex
  }
`;

// Helper for portable text with language suffix
// @sanity-typegen-ignore
const serviceContentQuery = (lang: string) => `
  "content": content_${lang}[] {
    _key,
    ...select(
      _type == "block" => {
        ${portableTextInnerQuery}
      },
      _type == "imageAndText.block" => {
        ${imageAndTextBlockQuery}
      },
      _type == "callToAction.block" => {
        ${callToActionBlockQuery}
      },
      _type == "figure" => {
        ${figureBlockQuery}
      },
      _type == "accordion.block" => {
        "_type": "accordion.block",
        heading
      }
    )
  }
`;

export const serviceQuery = defineQuery(`
  *[_type == "service" && (
    ($locale == "no" && slug_no.current == $slug) ||
    ($locale == "en" && slug_en.current == $slug)
  )][0] {
    _id,
    "title": select(
      $locale == "no" => title_no,
      $locale == "en" => title_en
    ),
    "excerpt": select(
      $locale == "no" => excerpt_no,
      $locale == "en" => excerpt_en
    ),
    "slug": select(
      $locale == "no" => slug_no.current,
      $locale == "en" => slug_en.current
    ),
    "media": {
      "mediaType": media.mediaType,
      "image": media.image { ${imageQuery} },
      "illustration": media.illustration
    },
    "subServicesDescription": select(
      $locale == "no" => subServicesDescription_no,
      $locale == "en" => subServicesDescription_en
    ),
    "subServices": *[_type == "subService" && references(^._id)] | order(title_no asc) {
      _id,
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
      }
    },
    ...select(
      $locale == "no" => { ${serviceContentQuery("no")} },
      $locale == "en" => { ${serviceContentQuery("en")} }
    ),
    ...select(
      $locale == "no" => { ${serviceMetadataQuery("no")} },
      $locale == "en" => { ${serviceMetadataQuery("en")} }
    ),
    "translations": [
      select(defined(slug_no.current) => {"slug": slug_no.current, "language": "no"}),
      select(defined(slug_en.current) => {"slug": slug_en.current, "language": "en"})
    ]
  }
`);

export const serviceSlugsQuery = defineQuery(`
  *[_type == "service"] {
    "slugs": [
      select(defined(slug_no.current) => {"slug": slug_no.current, "locale": "no"}),
      select(defined(slug_en.current) => {"slug": slug_en.current, "locale": "en"})
    ]
  }
`);
