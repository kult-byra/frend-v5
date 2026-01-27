import { defineQuery } from "next-sanity";
import { imageQuery } from "../utils/image.query";

// @sanity-typegen-ignore
export const imageGalleryBlockQuery = defineQuery(`
  _type,
  _key,
  images[] {
    _key,
    _type,
    "mediaType": media.mediaType,
    "image": media.image { ${imageQuery} },
    "videoUrl": media.videoUrl,
    imageFormat
  }
`);
