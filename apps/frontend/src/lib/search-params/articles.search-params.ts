import { createSearchParamsCache, parseAsInteger } from "nuqs/server";

export const ARTICLES_PER_PAGE = 12;

export const articlesSearchParams = {
  page: parseAsInteger.withDefault(1),
};

export const articlesParamsCache = createSearchParamsCache(articlesSearchParams);
