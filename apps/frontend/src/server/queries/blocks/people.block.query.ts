import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";

// @sanity-typegen-ignore
export const peopleBlockQuery = defineQuery(`
  _type,
  _key,
  title,
  "excerpt": excerpt[] {
    _key,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  },
  people[]-> {
    _id,
    name,
    role_no,
    role_en,
    company,
    externalPerson,
    image { ${imageQuery} }
  }
`);
