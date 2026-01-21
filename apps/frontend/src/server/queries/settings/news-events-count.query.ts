import { defineQuery } from "next-sanity";

export const newsEventsCountQuery = defineQuery(`
  count(*[_type == "newsArticle" && publishDate < now() && language == $locale]) + count(*[_type == "event" && timeAndDate.startTime > now() && language == $locale])
`);
