// Define the structure for the transformed route configuration

import { routeConfig } from "@workspace/routing/src/route.config";

import {
  type DocumentLocationResolvers,
  type DocumentResolver,
  defineLocations,
} from "sanity/presentation";

// Function to transform routeConfig into the desired format
// Function to transform routeConfig into DocumentResolver[]
function transformRouteConfig(config: typeof routeConfig): DocumentResolver[] {
  return Object.entries(config).map(([type, route]): DocumentResolver => {
    if (route.includes(":")) {
      // For dynamic routes
      const [_basePath, param] = route.split(":");
      return {
        route: route,
        filter: `_type == "${type}" && ${param}.current == $${param}`,
      };
    }
    // For static routes
    return {
      route: route,
      type: type,
    };
  });
}
// Usage

export const presentationMainRoutes = transformRouteConfig(routeConfig);

function createLocations(config: typeof routeConfig): DocumentLocationResolvers {
  const locations: DocumentLocationResolvers = {};

  for (const [key, path] of Object.entries(config)) {
    locations[key] = defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            href: path.includes(":slug") ? path.replace(":slug", `${doc?.slug}`) : path,
            title: doc?.title,
          },
          ...(path.includes(":slug") && path.split("/").length > 2
            ? [
                {
                  href: path.split("/:")[0],
                  title: "Innholdsoversikt", // Simple pluralization, may need adjustment
                },
              ]
            : []),
        ],
      }),
    });
  }

  return locations;
}

export const presentationLocations = createLocations(routeConfig);
