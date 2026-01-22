import type { LinkableType } from "./linkable-types";

// Combine the constraints of LinkableType and Route<T>
type ValidRouteConfig = {
  [K in LinkableType]: string;
};

/**
 * Route configuration using English paths as internal/code base.
 * These are the canonical paths used in code and file system.
 */
export const routeConfig = {
  frontPage: "/",
  newsAndEventsArchive: "/articles",
  page: "/:slug",
  newsArticle: "/news/:slug",
  event: "/events/:slug",
  servicesArchive: "/services",
  service: "/services/:slug",
  subService: "/services/:parentSlug/:slug",
  knowledgeHub: "/knowledge",
  knowledgeArticle: "/knowledge/:slug",
  knowledgeArticleArchive: "/knowledge/articles",
  seminar: "/seminars/:slug",
  seminarArchive: "/seminars",
  caseStudy: "/projects/:slug",
  caseStudyArchive: "/projects",
  eBook: "/ebooks/:slug",
  eBookArchive: "/ebooks",
  client: "/clients/:slug",
  clientArchive: "/clients",
  conversionPage: "/:slug",
} as const satisfies ValidRouteConfig;

// Helper function to get the route path
export const getRoutePath = <T extends LinkableType>(type: T) => {
  return routeConfig[type];
};

// Helper function to get the root path
const getRootPath = (path: string): string => {
  const segments = path.split("/");
  return segments[1] || "/"; // Return the second segment or '/' if it's the root
};

// Get array of root paths
export const ROOT_PATHS = [
  ...new Set(
    Object.values(routeConfig)
      .map(getRootPath)
      .filter(Boolean), // Remove empty strings
  ),
] as const;

// Infer the type of rootPaths
export type RootPath = (typeof ROOT_PATHS)[number];

/**
 * Route translations: maps English (internal) segments to localized segments.
 * Keys are English, values are the translated versions.
 */
export const routeTranslations = {
  no: {
    articles: "artikler",
    news: "nyheter",
    events: "arrangementer",
    services: "tjenester",
    knowledge: "kunnskap",
    seminars: "seminarer",
    projects: "prosjekter",
    clients: "kunder",
    ebooks: "e-boker",
  },
  en: {
    articles: "articles",
    news: "news",
    events: "events",
    services: "services",
    knowledge: "knowledge",
    seminars: "seminars",
    projects: "projects",
    clients: "clients",
    ebooks: "ebooks",
  },
} as const;

export type Locale = keyof typeof routeTranslations;

/**
 * Pathnames configuration for next-intl.
 * Keys are English (internal) paths matching the file system.
 * Values define the localized URLs for each locale.
 * Norwegian (no) is the default locale with translated URLs.
 */
export const pathnames = {
  "/": "/",
  "/articles": {
    no: "/artikler",
    en: "/articles",
  },
  "/news/[slug]": {
    no: "/nyheter/[slug]",
    en: "/news/[slug]",
  },
  "/events/[slug]": {
    no: "/arrangementer/[slug]",
    en: "/events/[slug]",
  },
  "/services": {
    no: "/tjenester",
    en: "/services",
  },
  "/services/[slug]": {
    no: "/tjenester/[slug]",
    en: "/services/[slug]",
  },
  "/services/[slug]/[subSlug]": {
    no: "/tjenester/[slug]/[subSlug]",
    en: "/services/[slug]/[subSlug]",
  },
  "/knowledge": {
    no: "/kunnskap",
    en: "/knowledge",
  },
  "/knowledge/[slug]": {
    no: "/kunnskap/[slug]",
    en: "/knowledge/[slug]",
  },
  "/knowledge/articles": {
    no: "/kunnskap/artikler",
    en: "/knowledge/articles",
  },
  "/seminars": {
    no: "/seminarer",
    en: "/seminars",
  },
  "/seminars/[slug]": {
    no: "/seminarer/[slug]",
    en: "/seminars/[slug]",
  },
  "/projects": {
    no: "/prosjekter",
    en: "/projects",
  },
  "/projects/[slug]": {
    no: "/prosjekter/[slug]",
    en: "/projects/[slug]",
  },
  "/ebooks": {
    no: "/e-boker",
    en: "/ebooks",
  },
  "/ebooks/[slug]": {
    no: "/e-boker/[slug]",
    en: "/ebooks/[slug]",
  },
  "/clients": {
    no: "/kunder",
    en: "/clients",
  },
  "/clients/[slug]": {
    no: "/kunder/[slug]",
    en: "/clients/[slug]",
  },
  "/[slug]": "/[slug]",
} as const;
