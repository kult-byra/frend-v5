import { defineQuery } from "next-sanity";

// @sanity-typegen-ignore
export const codeBlockQuery = defineQuery(`
  _type,
  _key,
  heading,
  description,
  code,
  language,
  options { width }
`);
