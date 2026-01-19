import { defineQuery } from "next-sanity";

export const stringTranslationsQuery = defineQuery(`
  *[_type == "stringTranslations" && language == $locale][0] {
    skipToMain,
    languageLabel,
    notFound,
    navHome,
    navArticles,
    navServices
  }
`);
