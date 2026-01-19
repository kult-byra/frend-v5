import { defineQuery } from "next-sanity";
import { portableTextQuery } from "../portable-text/portable-text-inner.query";

// @sanity-typegen-ignore
export const contentBlockQuery = defineQuery(`
  _type,
  _key,
  ${portableTextQuery}
`);
