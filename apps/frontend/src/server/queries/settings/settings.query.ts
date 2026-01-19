import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { menuSettingsQuery } from "./menu-settings.query";
import { metadataSettingsQuery } from "./metadata-settings.query";
import { newsEventsCountQuery } from "./news-events-count.query";
import { siteSettingsQuery } from "./site-settings.query";

const settingsQuery = defineQuery(`{
  "siteSettings": ${siteSettingsQuery},
  "menuSettings": ${menuSettingsQuery},
  "metadataSettings": ${metadataSettingsQuery},
  "newsEventsCount": ${newsEventsCountQuery}
}`);

export const fetchSettings = async () => {
  const data = await sanityFetch({
    query: settingsQuery,
  });

  return data.data;
};
