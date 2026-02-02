import { defineQuery } from "next-sanity";

// @sanity-typegen-ignore
export const logoCloudBlockQuery = defineQuery(`
  _type,
  _key,
  logos[]-> {
    _id,
    title,
    "url": logo.asset->url
  },
  options { width }
`);
