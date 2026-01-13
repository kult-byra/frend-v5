import { defineQuery } from "next-sanity";
import { pageBuilderQuery } from "../page-builder/page-builder-full.query";

export const frontPageQuery = defineQuery(`
  *[_type == "siteSettings"][0].frontPage-> {
    _id,
    ${pageBuilderQuery}
  }
`);
