import type { LinkableType } from "./linkable-types";

// Combine the constraints of LinkableType and Route<T>
type ValidRouteConfig = {
  [K in LinkableType]: string;
};

export const routeConfig = {
  frontPage: "/",
  newsAndEventsArchive: "/artikler",
  page: "/:slug",
  newsArticle: "/nyheter/:slug",
  event: "/arrangementer/:slug",
  servicesArchive: "/tjenester",
  service: "/tjenester/:slug",
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
