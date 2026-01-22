"use server";

import type { LinkableType, Locale } from "@workspace/routing";
import { resolvePath } from "@workspace/routing";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/server/sanity/sanity-live";

const translatedUrlQuery = defineQuery(`
  *[slug.current == $slug && language == $currentLocale][0] {
    _type,
    "slug": slug.current,
    "parentSlug": parent->slug.current,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
      "parentSlug": parent->slug.current,
      language
    }
  }
`);

type TranslatedUrlResult = {
  url: string;
  fallbackToHome: boolean;
};

// Map Sanity document types to LinkableType
const typeToLinkable: Record<string, LinkableType> = {
  page: "page",
  newsArticle: "newsArticle",
  event: "event",
  service: "service",
  subService: "subService",
  knowledgeArticle: "knowledgeArticle",
  seminar: "seminar",
  caseStudy: "caseStudy",
  eBook: "eBook",
  client: "client",
  conversionPage: "conversionPage",
};

/**
 * Get the translated URL for the current page when switching languages.
 * If no translation exists, returns home URL and fallbackToHome: true
 */
export async function getTranslatedUrl(
  currentSlug: string,
  currentLocale: string,
  targetLocale: string,
): Promise<TranslatedUrlResult> {
  // Handle front page (empty slug or just "/")
  if (!currentSlug || currentSlug === "/") {
    return { url: "/", fallbackToHome: false };
  }

  try {
    const { data } = await sanityFetch({
      query: translatedUrlQuery,
      params: { slug: currentSlug, currentLocale },
      stega: false,
    });

    if (!data?._translations) {
      return { url: "/", fallbackToHome: true };
    }

    const targetTranslation = data._translations.find(
      (t: { slug: string | null; language: string | null } | null) => t?.language === targetLocale,
    );

    if (targetTranslation?.slug) {
      // Get the linkable type for URL resolution
      const linkableType = typeToLinkable[data._type];

      if (linkableType) {
        // Build params for URL resolution
        const params: Record<string, string> = { slug: targetTranslation.slug };
        if (targetTranslation.parentSlug) {
          params.parentSlug = targetTranslation.parentSlug;
        }

        const url = resolvePath(linkableType, params, targetLocale as Locale);
        return { url, fallbackToHome: false };
      }

      // Fallback: just use the slug directly
      return { url: `/${targetTranslation.slug}`, fallbackToHome: false };
    }

    return { url: "/", fallbackToHome: true };
  } catch (error) {
    console.error("Error fetching translated URL:", error);
    return { url: "/", fallbackToHome: true };
  }
}
