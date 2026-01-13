import { defineQuery } from "next-sanity";
import { pageBuilderQuery } from "@/server/queries/page-builder/page-builder-full.query";
import { metadataQuery } from "@/server/queries/utils/metadata.query";

export const pageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    ${pageBuilderQuery},
    ${metadataQuery}
  }
`);

export const pageSlugsQuery = defineQuery(`
  *[_type == "page"] {
    "slug": slug.current
  }
`);
