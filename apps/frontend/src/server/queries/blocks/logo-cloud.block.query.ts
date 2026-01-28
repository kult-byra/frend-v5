import { defineQuery } from "next-sanity";
import { imageQuery } from "../utils/image.query";

// @sanity-typegen-ignore
export const logoCloudBlockQuery = defineQuery(`
  _type,
  _key,
  logos[]-> {
    _id,
    title,
    image { ${imageQuery} }
  },
  options { width }
`);
