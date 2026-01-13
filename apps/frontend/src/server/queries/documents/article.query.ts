import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { metadataQuery } from "../utils/metadata.query";

export const articleQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    ${fullPortableTextQuery},
    ${metadataQuery}
  }
`);

export const articleSlugsQuery = defineQuery(`
  *[_type == "article"] {
    "slug": slug.current
  }
`);
