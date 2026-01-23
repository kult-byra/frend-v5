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
    ),
    "noResults": select(
      $locale == "no" => noResults_no,
      $locale == "en" => noResults_en
    ),
    "filters": select(
      $locale == "no" => filters_no,
      $locale == "en" => filters_en
    ),
    "sorting": select(
      $locale == "no" => sorting_no,
      $locale == "en" => sorting_en
    ),
    "technologies": select(
      $locale == "no" => technologies_no,
      $locale == "en" => technologies_en
    ),
    "industries": select(
      $locale == "no" => industries_no,
      $locale == "en" => industries_en
    ),
    "applyFilters": select(
      $locale == "no" => applyFilters_no,
      $locale == "en" => applyFilters_en
    ),
    "clearAll": select(
      $locale == "no" => clearAll_no,
      $locale == "en" => clearAll_en
    ),
    "newestFirst": select(
      $locale == "no" => newestFirst_no,
      $locale == "en" => newestFirst_en
    ),
    "oldestFirst": select(
      $locale == "no" => oldestFirst_no,
      $locale == "en" => oldestFirst_en
    )
  }
`);
