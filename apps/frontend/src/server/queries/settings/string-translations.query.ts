import { defineQuery } from "next-sanity";

// Field-level i18n: selects locale-specific string fields and aliases them
export const stringTranslationsQuery = defineQuery(`
  *[_type == "stringTranslations"][0] {
    "skipToMain": select(
      $locale == "no" => skipToMain_no,
      $locale == "en" => skipToMain_en
    ),
    "languageLabel": select(
      $locale == "no" => languageLabel_no,
      $locale == "en" => languageLabel_en
    ),
    "notFound": select(
      $locale == "no" => notFound_no,
      $locale == "en" => notFound_en
    ),
    "navHome": select(
      $locale == "no" => navHome_no,
      $locale == "en" => navHome_en
    ),
    "navArticles": select(
      $locale == "no" => navArticles_no,
      $locale == "en" => navArticles_en
    ),
    "navServices": select(
      $locale == "no" => navServices_no,
      $locale == "en" => navServices_en
    ),
    "featured": select(
      $locale == "no" => featured_no,
      $locale == "en" => featured_en
    )
  }
`);
