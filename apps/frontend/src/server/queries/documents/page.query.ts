import { defineQuery } from "next-sanity";
import { pageBuilderQuery } from "@/server/queries/page-builder/page-builder-full.query";
import { metadataQuery } from "@/server/queries/utils/metadata.query";
import { translationsQuery } from "@/server/queries/utils/translations.query";

export const pageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug && language == $locale][0] {
    _id,
    ${pageBuilderQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const pageSlugsQuery = defineQuery(`
  *[_type == "page"] {
    "slug": slug.current,
    "locale": language
  }
`);
