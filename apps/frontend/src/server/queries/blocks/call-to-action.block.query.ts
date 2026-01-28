import { defineQuery } from "next-sanity";
import { portableTextQuery } from "../portable-text/portable-text-inner.query";
import { linksQuery } from "../utils/links.query";

// @sanity-typegen-ignore
export const callToActionBlockQuery = defineQuery(`
  _type,
  _key,
  heading,
  ${portableTextQuery},
  links[]{
    ${linksQuery}
  },
  options { width }
`);
