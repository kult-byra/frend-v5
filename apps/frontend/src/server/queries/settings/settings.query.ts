import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { footerSettingsQuery } from "./footer-settings.query";
import { menuSettingsQuery } from "./menu-settings.query";
import { metadataSettingsQuery } from "./metadata-settings.query";
import { newsEventsCountQuery } from "./news-events-count.query";
import { organisationSettingsQuery } from "./organisation-settings.query";
import { siteSettingsQuery } from "./site-settings.query";
import { stringTranslationsQuery } from "./string-translations.query";

const settingsQuery = defineQuery(`{
  "siteSettings": ${siteSettingsQuery},
  "menuSettings": ${menuSettingsQuery},
  "metadataSettings": ${metadataSettingsQuery},
  "newsEventsCount": ${newsEventsCountQuery},
  "stringTranslations": ${stringTranslationsQuery},
  "footerSettings": ${footerSettingsQuery},
  "organisationSettings": ${organisationSettingsQuery}
}`);

export const fetchSettings = async (locale: string) => {
  const data = await sanityFetch({
    query: settingsQuery,
    params: { locale },
  });

  return data.data;
};
