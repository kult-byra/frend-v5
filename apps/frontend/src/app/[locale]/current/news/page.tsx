import type { Metadata } from "next";
import { NewsTeaser } from "@/components/teasers/news.teaser";
import type { Locale } from "@/i18n/routing";
import type {
  NewsArchiveIndustriesQueryResult,
  NewsArchiveServicesQueryResult,
  NewsArchiveSettingsQueryResult,
  NewsArchiveTechnologiesQueryResult,
} from "@/sanity-types";
import {
  type NewsArchiveResult,
  newsArchiveIndustriesQuery,
  newsArchiveQuery,
  newsArchiveServicesQuery,
  newsArchiveSettingsQuery,
  newsArchiveTechnologiesQuery,
} from "@/server/queries/documents/news-archive.query";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { NewsFilterHeader } from "../(parts)/news-filter-header.component";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    service?: string;
    tech?: string | string[];
    industry?: string | string[];
    sort?: string;
  }>;
};

async function getArchiveSettings(locale: string) {
  const { data } = await sanityFetch({
    query: newsArchiveSettingsQuery,
    params: { locale },
    tags: ["newsAndEventsArchive"],
  });

  return data as NewsArchiveSettingsQueryResult;
}

async function getNewsArticles(
  locale: string,
  service?: string,
  technologies?: string[],
  industries?: string[],
  sort?: string,
) {
  const { data } = await sanityFetch({
    query: newsArchiveQuery,
    params: {
      locale,
      service: service || null,
      technologies: technologies && technologies.length > 0 ? technologies : null,
      industries: industries && industries.length > 0 ? industries : null,
      sort: sort || "newest",
    },
    tags: ["newsArticle"],
  });

  return data as NewsArchiveResult;
}

async function getServices(locale: string) {
  const { data } = await sanityFetch({
    query: newsArchiveServicesQuery,
    params: { locale },
    tags: ["service"],
  });

  return data as NewsArchiveServicesQueryResult;
}

async function getTechnologies() {
  const { data } = await sanityFetch({
    query: newsArchiveTechnologiesQuery,
    tags: ["technology"],
  });

  return data as NewsArchiveTechnologiesQueryResult;
}

async function getIndustries() {
  const { data } = await sanityFetch({
    query: newsArchiveIndustriesQuery,
    tags: ["industry"],
  });

  return data as NewsArchiveIndustriesQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function NewsArchivePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { service, tech, industry, sort } = await searchParams;

  // Normalize array params (can be string or string[])
  const techFilters = tech ? (Array.isArray(tech) ? tech : [tech]) : [];
  const industryFilters = industry ? (Array.isArray(industry) ? industry : [industry]) : [];

  const [articles, services, technologies, industries, settings] = await Promise.all([
    getNewsArticles(locale, service, techFilters, industryFilters, sort),
    getServices(locale),
    getTechnologies(),
    getIndustries(),
    fetchSettings(locale as Locale),
  ]);

  const stringTranslations = settings.stringTranslations;

  // Sort articles based on sort parameter
  let newsArticles = articles ?? [];
  if (newsArticles.length > 0 && sort === "oldest") {
    newsArticles = [...newsArticles].sort((a, b) => {
      const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return dateA - dateB;
    });
  }

  // Normalize services for filter - use slug or generate from title
  const normalizedServices =
    services?.map((s) => ({
      ...s,
      slug: s.slug ?? s.title?.toLowerCase().replace(/\s+/g, "-") ?? null,
    })) ?? [];

  return (
    <>
      <NewsFilterHeader
        services={normalizedServices}
        technologies={technologies ?? []}
        industries={industries ?? []}
        translations={{
          all: stringTranslations?.all,
          filtersAndSort: stringTranslations?.filtersAndSort,
          filters: stringTranslations?.filters,
          sorting: stringTranslations?.sorting,
          technologies: stringTranslations?.technologies,
          industries: stringTranslations?.industries,
          newestFirst: stringTranslations?.newestFirst,
          oldestFirst: stringTranslations?.oldestFirst,
          applyFilters: stringTranslations?.applyFilters,
          clearAll: stringTranslations?.clearAll,
        }}
      />

      {newsArticles && newsArticles.length > 0 ? (
        <ul className="grid grid-cols-1 gap-xs lg:grid-cols-3 lg:gap-sm">
          {newsArticles.map((article) => (
            <li key={article._id}>
              <NewsTeaser
                item={article}
                typeLabel={stringTranslations?.labelNews}
                locale={locale}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-text-secondary">
            {stringTranslations?.noResults ?? "No results found for the selected filters."}
          </p>
        </div>
      )}
    </>
  );
}
