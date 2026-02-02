import type { LinkableType } from "./linkable-types";
import { pathnames } from "./pathnames";

// Re-export pathnames for convenience
export { pathnames };

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
  newsAndEventsArchive: "/current",
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
  seminarArchive: "/knowledge/seminars",
  caseStudy: "/projects/:slug",
  caseStudyArchive: "/knowledge/case-studies",
  eBook: "/ebooks/:slug",
  eBookArchive: "/knowledge/ebooks",
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
    current: "aktuelt",
    news: "nyheter",
    events: "arrangementer",
    services: "tjenester",
    knowledge: "kunnskap",
    articles: "artikler",
    seminars: "seminarer",
    "case-studies": "prosjekter",
    projects: "prosjekter",
    clients: "kunder",
    ebooks: "e-boker",
  },
  en: {
    current: "current",
    news: "news",
    events: "events",
    services: "services",
    knowledge: "knowledge",
    articles: "articles",
    seminars: "seminars",
    "case-studies": "case-studies",
    projects: "projects",
    clients: "clients",
    ebooks: "ebooks",
  },
} as const;

export type Locale = keyof typeof routeTranslations;
