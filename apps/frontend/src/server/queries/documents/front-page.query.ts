import { defineQuery } from "next-sanity";
import { pageBuilderQuery } from "../page-builder/page-builder-full.query";
import { translationsQuery } from "../utils/translations.query";

export const frontPageQuery = defineQuery(`
  *[_type == "siteSettings" && language == $locale][0].frontPage-> {
    _id,
    ${pageBuilderQuery},
    ${translationsQuery}
  }
`);
