import { defineQuery } from "next-sanity";
import { portableTextQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";
import { linksQuery } from "../utils/links.query";

// @sanity-typegen-ignore
export const imageAndTextBlockQuery = defineQuery(`
  _type,
  _key,
  heading,
  ${portableTextQuery},
  links[] {
    ${linksQuery}
  },
  image {
    ${imageQuery}
  },
  options {
    imagePosition
  }
`);
