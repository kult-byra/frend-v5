import { defineQuery } from "next-sanity";
import { imageQuery } from "../utils/image.query";

// @sanity-typegen-ignore
export const figureBlockQuery = defineQuery(`
  _type,
  _key,
  mediaType,
  image { ${imageQuery} },
  videoUrl,
  videoDisplayMode,
  illustration
`);
