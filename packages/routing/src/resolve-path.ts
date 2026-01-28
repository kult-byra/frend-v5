import type { LinkableType } from "./linkable-types";
import { type Locale, routeConfig, routeTranslations } from "./route.config";

// Helper type to extract path parameters
type ExtractPathParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ExtractPathParams<Rest>
  : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : Record<string, never>;

// Infer the Routes type from the routeConfig
type Routes = typeof routeConfig;

// Helper function to translate route segments based on locale
const translatePath = (path: string, locale: Locale): string => {
  // English paths stay as-is (internal paths are in English)
  if (locale === "en") {
    return path;
  }

  const translations = routeTranslations[locale];
  const segments = path.split("/");

  const translatedSegments = segments.map((segment) => {
    // Check if segment is a translatable route key
    if (segment in translations) {
      return translations[segment as keyof typeof translations];
    }
    return segment;
  });

  return translatedSegments.join("/");
};

// Overloaded resolvePath function for type safety
export function resolvePath<T extends LinkableType>(
  type: T,
  params: ExtractPathParams<Routes[T]>,
  locale?: Locale,
): string;
export function resolvePath<T extends LinkableType>(type: T, locale?: Locale): string;
// Dynamic overload for runtime use when params type is unknown
export function resolvePath(
  type: LinkableType,
  params: Record<string, string>,
  locale: Locale,
): string;
export function resolvePath<T extends LinkableType>(
  type: T,
  paramsOrLocale?: ExtractPathParams<Routes[T]> | Locale | Record<string, string>,
  locale?: Locale,
): string {
  let path = routeConfig[type] as string;
  let finalLocale: Locale | undefined;

  // Determine if second arg is params or locale
  if (paramsOrLocale !== undefined) {
    if (typeof paramsOrLocale === "string") {
      // It's a locale
      finalLocale = paramsOrLocale as Locale;
    } else {
      // It's params object
      const params = paramsOrLocale as Record<string, string>;
      for (const [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, value);
      }
      finalLocale = locale;
    }
  }

  if (finalLocale) {
    return translatePath(path, finalLocale);
  }

  return path;
}
