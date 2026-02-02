/**
 * Pathnames configuration for next-intl middleware.
 * This file is kept separate to avoid pulling in Sanity type dependencies
 * which can cause issues in Edge Runtime on Vercel.
 *
 * Keys are English (internal) paths matching the file system.
 * Values define the localized URLs for each locale.
 * Norwegian (no) is the default locale with translated URLs.
 */
export const pathnames = {
  "/": "/",
  "/current": {
    no: "/aktuelt",
    en: "/current",
  },
  "/current/news": {
    no: "/aktuelt/nyheter",
    en: "/current/news",
  },
  "/current/events": {
    no: "/aktuelt/arrangementer",
    en: "/current/events",
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
  "/knowledge/case-studies": {
    no: "/kunnskap/prosjekter",
    en: "/knowledge/case-studies",
  },
  "/knowledge/seminars": {
    no: "/kunnskap/seminarer",
    en: "/knowledge/seminars",
  },
  "/knowledge/ebooks": {
    no: "/kunnskap/e-boker",
    en: "/knowledge/ebooks",
  },
  "/seminars/[slug]": {
    no: "/seminarer/[slug]",
    en: "/seminars/[slug]",
  },
  "/projects/[slug]": {
    no: "/prosjekter/[slug]",
    en: "/projects/[slug]",
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
  "/people/[slug]": {
    no: "/folk/[slug]",
    en: "/people/[slug]",
  },
  "/[slug]": "/[slug]",
} as const;
