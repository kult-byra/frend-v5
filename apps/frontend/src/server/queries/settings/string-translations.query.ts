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
    ),
    "chapters": select(
      $locale == "no" => chapters_no,
      $locale == "en" => chapters_en
    ),
    "all": select(
      $locale == "no" => all_no,
      $locale == "en" => all_en
    ),
    "filtersAndSort": select(
      $locale == "no" => filtersAndSort_no,
      $locale == "en" => filtersAndSort_en
    ),
    "caseStudies": select(
      $locale == "no" => caseStudies_no,
      $locale == "en" => caseStudies_en
    ),
    "articlesAndInsights": select(
      $locale == "no" => articlesAndInsights_no,
      $locale == "en" => articlesAndInsights_en
    ),
    "seminars": select(
      $locale == "no" => seminars_no,
      $locale == "en" => seminars_en
    ),
    "ebooks": select(
      $locale == "no" => ebooks_no,
      $locale == "en" => ebooks_en
    )
  }
`);
