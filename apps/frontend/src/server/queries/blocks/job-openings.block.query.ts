import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";

// @sanity-typegen-ignore
export const jobOpeningsBlockQuery = defineQuery(`
  _type,
  _key,
  heading,
  "description": description[] {
    _key,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  }
`);
