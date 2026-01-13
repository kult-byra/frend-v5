import { defineQuery } from "next-sanity";
import type { MetadataPageQueryResult } from "@/sanity-types";

// @sanity-typegen-ignore
const metadataImageInnerQuery = defineQuery(`
  "id": asset._ref,
  altText
`);

// @sanity-typegen-ignore
export const metadataQuery = defineQuery(`
  "metadata": {
    "title": coalesce(metadata.title, title, name),
    "desc": coalesce(metadata.desc, excerpt),
    "image": select(
      defined(metadata.image.asset._ref) => metadata.image {
        ${metadataImageInnerQuery}
      },
      defined(image.asset._ref) => image {
        ${metadataImageInnerQuery}
      },
      defined(coverImage.asset._ref) => coverImage {
        ${metadataImageInnerQuery}
      },
      defined(hero.image.asset._ref) => hero.image {
        ${metadataImageInnerQuery}
      }
    ),
    "tags": metadata.tags,
    "noIndex": metadata.noIndex
  }
`);

export const metadataPageQuery = defineQuery(`
  *[_type == "page"][0]{
      ${metadataQuery}
  }
`);

export type MetaDataQuery = NonNullable<MetadataPageQueryResult>["metadata"];
