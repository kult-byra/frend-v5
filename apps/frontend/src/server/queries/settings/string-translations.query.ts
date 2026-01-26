import { defineQuery } from "next-sanity";

// Internationalized array: each field is an array with _key per locale
export const stringTranslationsQuery = defineQuery(`
  *[_type == "stringTranslations"][0] {
    "skipToMain": skipToMain[_key == $locale][0].value,
    "languageLabel": languageLabel[_key == $locale][0].value,
    "notFound": notFound[_key == $locale][0].value,
    "navHome": navHome[_key == $locale][0].value,
    "navArticles": navArticles[_key == $locale][0].value,
    "navServices": navServices[_key == $locale][0].value,
    "featured": featured[_key == $locale][0].value,
    "chapters": chapters[_key == $locale][0].value,
    "all": all[_key == $locale][0].value,
    "filtersAndSort": filtersAndSort[_key == $locale][0].value,
    "caseStudies": caseStudies[_key == $locale][0].value,
    "articlesAndInsights": articlesAndInsights[_key == $locale][0].value,
    "seminars": seminars[_key == $locale][0].value,
    "ebooks": ebooks[_key == $locale][0].value,
    "noResults": noResults[_key == $locale][0].value,
    "filters": filters[_key == $locale][0].value,
    "sorting": sorting[_key == $locale][0].value,
    "technologies": technologies[_key == $locale][0].value,
    "industries": industries[_key == $locale][0].value,
    "applyFilters": applyFilters[_key == $locale][0].value,
    "clearAll": clearAll[_key == $locale][0].value,
    "newestFirst": newestFirst[_key == $locale][0].value,
    "oldestFirst": oldestFirst[_key == $locale][0].value
  }
`);
