import { defineQuery } from "next-sanity";
import { imageQuery } from "./image.query";

/**
 * Query fragment for media fields (image/video with aspect ratio)
 * Use this when the media fields are at the current level
 */
// @sanity-typegen-ignore
export const mediaQuery = defineQuery(`
  mediaType,
  "image": image { ${imageQuery} },
  videoUrl,
  illustration,
  aspectRatio
`);

/**
 * Query fragment for nested media fields
 * Use this when media is nested under a 'media' object
 * @param prefix - The prefix path to the media object (default: "media")
 */
export const nestedMediaQuery = (prefix = "media") => `
  "mediaType": ${prefix}.mediaType,
  "image": ${prefix}.image { ${imageQuery} },
  "videoUrl": ${prefix}.videoUrl,
  "aspectRatio": ${prefix}.aspectRatio
`;
