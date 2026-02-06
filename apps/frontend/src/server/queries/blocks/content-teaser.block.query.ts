import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";
import { linksQuery } from "../utils/links.query";

// @sanity-typegen-ignore
export const contentTeaserBlockQuery = defineQuery(`
  _type,
  _key,
  sourceType,
  sourceType == "reference" => {
    "documents": documents[]-> {
      _id,
      _type,
      "slug": slug.current,
      "title": coalesce(hero.title, title),
      "image": coalesce(hero.media[0].image, media.image) {
        ${imageQuery}
      },
      "excerpt": coalesce(hero.excerpt, description)[] {
        _key,
        _type,
        _type == "block" => {
          ${portableTextInnerQuery}
        }
      }
    }
  },
  sourceType == "manual" => {
    title,
    "image": image {
      ${imageQuery}
    },
    excerpt[] {
      _key,
      _type,
      _type == "block" => {
        ${portableTextInnerQuery}
      }
    },
    links[] { ${linksQuery} }
  },
  options { width }
`);

// For typegen only
const _contentTeaserBlockTypegenQuery = defineQuery(`
  *[_type == "page"][0].pageBuilder[_type == "contentTeaser.block"][0] {
    ${contentTeaserBlockQuery}
  }
`);
