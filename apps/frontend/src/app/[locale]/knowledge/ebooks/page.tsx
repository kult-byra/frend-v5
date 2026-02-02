import type { Metadata } from "next";
import { KnowledgeTeaser, type KnowledgeTeaserData } from "@/components/teasers/knowledge.teaser";
import type { Locale } from "@/i18n/routing";
import type {
  EBookArchiveContentQueryResult,
  EBookArchiveSettingsQueryResult,
  KnowledgeHubIndustriesQueryResult,
  KnowledgeHubServicesQueryResult,
  KnowledgeHubTechnologiesQueryResult,
} from "@/sanity-types";
import { eBookArchiveSettingsQuery } from "@/server/queries/documents/e-book.query";
import {
  eBookArchiveContentQuery,
  knowledgeHubIndustriesQuery,
  knowledgeHubServicesQuery,
  knowledgeHubTechnologiesQuery,
} from "@/server/queries/documents/knowledge-hub.query";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import type { KnowledgeContentType } from "@/server/queries/teasers/knowledge-teaser.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { KnowledgeFilterHeader } from "../(parts)/knowledge-filter-header.component";

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
    query: eBookArchiveSettingsQuery,
    params: { locale },
    tags: ["eBookArchive"],
  });

  return data as EBookArchiveSettingsQueryResult;
}

async function getContent(locale: string) {
  const { data } = await sanityFetch({
    query: eBookArchiveContentQuery,
    params: { locale },
    tags: ["eBook"],
  });

  return data as EBookArchiveContentQueryResult;
}

async function getServices(locale: string) {
  const { data } = await sanityFetch({
    query: knowledgeHubServicesQuery,
    params: { locale },
    tags: ["service"],
  });

  return data as KnowledgeHubServicesQueryResult;
}

async function getTechnologies() {
  const { data } = await sanityFetch({
    query: knowledgeHubTechnologiesQuery,
    tags: ["technology"],
  });

  return data as KnowledgeHubTechnologiesQueryResult;
}

async function getIndustries() {
  const { data } = await sanityFetch({
    query: knowledgeHubIndustriesQuery,
    tags: ["industry"],
  });

  return data as KnowledgeHubIndustriesQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function EBooksArchivePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { service, tech, industry, sort } = await searchParams;

  // Normalize array params (can be string or string[])
  const techFilters = tech ? (Array.isArray(tech) ? tech : [tech]) : [];
  const industryFilters = industry ? (Array.isArray(industry) ? industry : [industry]) : [];

  const [content, services, technologies, industries, settings] = await Promise.all([
    getContent(locale),
    getServices(locale),
    getTechnologies(),
    getIndustries(),
    fetchSettings(locale as Locale),
  ]);

  // Filter and sort content based on URL params
  let filteredContent = content?.filter((item) => {
    // Filter by service
    if (service && item.services) {
      const hasMatchingService = item.services.some(
        (s) => s.title?.toLowerCase().replace(/\s+/g, "-") === service,
      );
      if (!hasMatchingService) {
        return false;
      }
    }

    // Filter by technologies
    if (techFilters.length > 0 && item.technologies) {
      const hasMatchingTech = item.technologies.some((t) => t._id && techFilters.includes(t._id));
      if (!hasMatchingTech) {
        return false;
      }
    }

    // Filter by industries
    if (industryFilters.length > 0 && item.industries) {
      const hasMatchingIndustry = item.industries.some(
        (i) => i._id && industryFilters.includes(i._id),
      );
      if (!hasMatchingIndustry) {
        return false;
      }
    }

    return true;
  });

  // Sort content
  if (sort === "oldest" && filteredContent) {
    filteredContent = [...filteredContent].sort((a, b) => {
      const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return dateA - dateB;
    });
  }

  const stringTranslations = settings.stringTranslations;

  const typeLabels: Partial<Record<KnowledgeContentType, string | null>> = {
    knowledgeArticle: stringTranslations?.labelArticle,
    caseStudy: stringTranslations?.labelCaseStudy,
    seminar: stringTranslations?.labelSeminar,
    eBook: stringTranslations?.labelEBook,
    newsArticle: stringTranslations?.labelNews,
    event: stringTranslations?.labelEvent,
  };

  // Normalize services for filter - use slug or generate from title
  const normalizedServices =
    services?.map((s) => ({
      ...s,
      slug: s.slug ?? s.title?.toLowerCase().replace(/\s+/g, "-") ?? null,
    })) ?? [];

  return (
    <>
      <KnowledgeFilterHeader
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
          applyFilters: stringTranslations?.applyFilters,
          clearAll: stringTranslations?.clearAll,
          newestFirst: stringTranslations?.newestFirst,
          oldestFirst: stringTranslations?.oldestFirst,
        }}
      />

      {filteredContent && filteredContent.length > 0 ? (
        <ul className="grid grid-cols-1 gap-xs lg:grid-cols-3 lg:gap-sm">
          {filteredContent.map((item) => (
            <li key={item._id}>
              <KnowledgeTeaser
                item={item as unknown as KnowledgeTeaserData}
                typeLabels={typeLabels}
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
