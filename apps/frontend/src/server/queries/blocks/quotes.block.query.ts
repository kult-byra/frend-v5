import { defineQuery } from "next-sanity";

// @sanity-typegen-ignore
export const quotesBlockQuery = defineQuery(`
  _type,
  _key,
  quotes[]-> {
    _id,
    quote,
    source {
      name,
      role
    }
  },
  options {
    layout
  }
`);
