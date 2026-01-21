import type { LinkableType } from "@workspace/routing/src/linkable-types";
import { routeConfig } from "@workspace/routing/src/route.config";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/server/sanity/sanity-live";

// @sanity-typegen-ignore
const sitemapFields = defineQuery(`
  _id,
  _updatedAt,
  _type,
  "slug": slug.current,
  title
`);

const routeTypes = Object.keys(routeConfig) as LinkableType[];

const sitemapQuery = defineQuery(`{
  "pages": *[_type in $routeTypes && !(_id in [*[_type == "siteSettings"][0].frontPage_no._ref, *[_type == "siteSettings"][0].frontPage_en._ref])] {
    ${sitemapFields}
  },
  "frontPage": *[_type == "siteSettings"][0].frontPage_no-> {
    ${sitemapFields}
  }
}`);

export const fetchSitemap = async () => {
  const sitemap = await sanityFetch({
    query: sitemapQuery,
    params: { routeTypes },
  });

  return sitemap.data;
};
