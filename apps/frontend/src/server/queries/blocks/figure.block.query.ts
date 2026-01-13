import { defineQuery } from "next-sanity";
import { imageInnerQuery } from "../utils/image.query";

// @sanity-typegen-ignore
export const figureBlockQuery = defineQuery(`
  _type,
  _key,
  ${imageInnerQuery}
`);
