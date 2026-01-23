import type { Metadata } from "next";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { KnowledgeTeaser, type KnowledgeTeaserData } from "@/components/teasers/knowledge.teaser";
import type { Locale } from "@/i18n/routing";
import type {
  KnowledgeHubContentQueryResult,
  KnowledgeHubServicesQueryResult,
  KnowledgeHubSettingsQueryResult,
} from "@/sanity-types";
import {
  knowledgeHubContentQuery,
  knowledgeHubServicesQuery,
  knowledgeHubSettingsQuery,
} from "@/server/queries/documents/knowledge-hub.query";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { KnowledgeFilterHeader } from "./(parts)/knowledge-filter-header.component";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; service?: string }>;
};

async function getHubSettings(locale: string) {
  const { data } = await sanityFetch({
    query: knowledgeHubSettingsQuery,
    params: { locale },
    tags: ["knowledgeHub"],
  });

  return data as KnowledgeHubSettingsQueryResult;
}

async function getHubContent(locale: string) {
  const { data } = await sanityFetch({
    query: knowledgeHubContentQuery,
    params: { locale },
    tags: ["knowledgeArticle", "caseStudy", "seminar", "eBook"],
  });

  return data as KnowledgeHubContentQueryResult;
}

async function getServices(locale: string) {
  const { data } = await sanityFetch({
    query: knowledgeHubServicesQuery,
    params: { locale },
    tags: ["service"],
  });

  return data as KnowledgeHubServicesQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getHubSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function KnowledgeHubPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type, service } = await searchParams;

  const [hubSettings, content, services, settings] = await Promise.all([
    getHubSettings(locale),
    getHubContent(locale),
    getServices(locale),
    fetchSettings(locale as Locale),
  ]);

  // Filter content based on URL params
  const filteredContent = content?.filter((item) => {
    // Filter by content type
    if (type && item._type !== type) {
      return false;
    }

    // Filter by service
    if (service && item.services) {
      const hasMatchingService = item.services.some(
        (s) => s.title?.toLowerCase().replace(/\s+/g, "-") === service,
      );
      if (!hasMatchingService) {
        return false;
      }
    }

    return true;
  });

  const stringTranslations = settings.stringTranslations;

  // Normalize services for filter - use slug or generate from title
  const normalizedServices =
    services?.map((s) => ({
      ...s,
      slug: s.slug ?? s.title?.toLowerCase().replace(/\s+/g, "-") ?? null,
    })) ?? [];

  return (
    <Container className="py-lg">
      <H1 className="mb-xs">{hubSettings?.title ?? "Kunnskap"}</H1>

      <KnowledgeFilterHeader
        services={normalizedServices}
        translations={{
          all: stringTranslations?.all,
          filtersAndSort: stringTranslations?.filtersAndSort,
          caseStudies: stringTranslations?.caseStudies,
          articlesAndInsights: stringTranslations?.articlesAndInsights,
          seminars: stringTranslations?.seminars,
          ebooks: stringTranslations?.ebooks,
        }}
      />

      <ul className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-3">
        {filteredContent?.map((item) => (
          <li key={item._id}>
            <KnowledgeTeaser item={item as KnowledgeTeaserData} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
