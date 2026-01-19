import { defineQuery } from "next-sanity";
import type { ImageTypegenQueryResult } from "@/sanity-types";

// @sanity-typegen-ignore
export const imageInnerQuery = defineQuery(`
  crop,
  hotspot,
  asset-> {
    _id,
    title,
    altText,
    description,
    metadata {
      lqip,
      dimensions {
        aspectRatio,
        width,
        height
      }
    }
  }
`);

// @sanity-typegen-ignore
export const imageQuery = defineQuery(`
  ${imageInnerQuery}
`);

const _imageTypegenQuery = defineQuery(`*[_type == "typegenSettings"][0]{
  image{
    ${imageQuery}
  }
}`);

export type ImageQueryProps = NonNullable<NonNullable<ImageTypegenQueryResult>["image"]>;
