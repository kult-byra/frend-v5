import { defineQuery } from "next-sanity";

import { fullPortableTextQuery } from "../portable-text/portable-text.query";

// @sanity-typegen-ignore
export const contentBlockQuery = defineQuery(`
  _type,
  _key,
  ${fullPortableTextQuery},
  options { width }
`);
