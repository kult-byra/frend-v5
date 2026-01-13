import type { LinkableType } from "./linkable-types";
import { routeConfig } from "./route.config";

// Helper type to extract path parameters
type ExtractPathParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ExtractPathParams<Rest>
  : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : Record<string, never>;

// Infer the Routes type from the routeConfig
type Routes = typeof routeConfig;

// Type for the navigate function
type NavigateFunction = <T extends keyof Routes>(
  route: T,
  ...params: ExtractPathParams<Routes[T]> extends Record<string, never>
    ? []
    : [ExtractPathParams<Routes[T]>]
) => Routes[T];

// Create the navigate function
const navigate: NavigateFunction = (route, ...params) => {
  let path = routeConfig[route];
  if (params.length > 0) {
    const [paramObj] = params;
    for (const [key, value] of Object.entries(paramObj ?? {})) {
      path = path.replace(`:${key}`, value) as Routes[typeof route];
    }
  }
  return path as Routes[typeof route];
};

// Export a type-safe resolvePath function
export const resolvePath = <T extends LinkableType>(
  type: T,
  ...params: ExtractPathParams<Routes[T]> extends Record<string, never>
    ? []
    : [ExtractPathParams<Routes[T]>]
) => {
  return navigate(type, ...params);
};
