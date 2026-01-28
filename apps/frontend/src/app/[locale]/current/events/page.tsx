import type { Metadata } from "next";
import { EventTeaser } from "@/components/teasers/event.teaser";
import type { Locale } from "@/i18n/routing";
import type {
  EventsArchiveIndustriesQueryResult,
  EventsArchiveServicesQueryResult,
  EventsArchiveSettingsQueryResult,
  EventsArchiveTechnologiesQueryResult,
} from "@/sanity-types";
import {
  type EventsArchiveResult,
  eventsArchiveIndustriesQuery,
  eventsArchiveQuery,
  eventsArchiveServicesQuery,
  eventsArchiveSettingsQuery,
  eventsArchiveTechnologiesQuery,
} from "@/server/queries/documents/events-archive.query";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { EventsFilterHeader } from "../(parts)/events-filter-header.component";

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
    query: eventsArchiveSettingsQuery,
    params: { locale },
    tags: ["newsAndEventsArchive"],
  });

  return data as EventsArchiveSettingsQueryResult;
}

async function getEvents(
  locale: string,
  service?: string,
  technologies?: string[],
  industries?: string[],
  sort?: string,
) {
  const { data } = await sanityFetch({
    query: eventsArchiveQuery,
    params: {
      locale,
      service: service || null,
      technologies: technologies && technologies.length > 0 ? technologies : null,
      industries: industries && industries.length > 0 ? industries : null,
      sort: sort || "newest",
    },
    tags: ["event"],
  });

  return data as EventsArchiveResult;
}

async function getServices(locale: string) {
  const { data } = await sanityFetch({
    query: eventsArchiveServicesQuery,
    params: { locale },
    tags: ["service"],
  });

  return data as EventsArchiveServicesQueryResult;
}

async function getTechnologies() {
  const { data } = await sanityFetch({
    query: eventsArchiveTechnologiesQuery,
    tags: ["technology"],
  });

  return data as EventsArchiveTechnologiesQueryResult;
}

async function getIndustries() {
  const { data } = await sanityFetch({
    query: eventsArchiveIndustriesQuery,
    tags: ["industry"],
  });

  return data as EventsArchiveIndustriesQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function EventsArchivePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { service, tech, industry, sort } = await searchParams;

  // Normalize array params (can be string or string[])
  const techFilters = tech ? (Array.isArray(tech) ? tech : [tech]) : [];
  const industryFilters = industry ? (Array.isArray(industry) ? industry : [industry]) : [];

  const [eventItems, services, technologies, industries, settings] = await Promise.all([
    getEvents(locale, service, techFilters, industryFilters, sort),
    getServices(locale),
    getTechnologies(),
    getIndustries(),
    fetchSettings(locale as Locale),
  ]);

  const stringTranslations = settings.stringTranslations;

  // Sort events based on sort parameter
  let events = eventItems ?? [];
  if (events.length > 0 && sort === "oldest") {
    events = [...events].sort((a, b) => {
      const dateA = a.timeAndDate?.startTime ? new Date(a.timeAndDate.startTime).getTime() : 0;
      const dateB = b.timeAndDate?.startTime ? new Date(b.timeAndDate.startTime).getTime() : 0;
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
      <EventsFilterHeader
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

      {events && events.length > 0 ? (
        <ul className="flex flex-col gap-xs lg:gap-sm">
          {events.map((event) => (
            <li key={event._id}>
              <EventTeaser
                item={event}
                typeLabel={stringTranslations?.labelEvent}
                locale={locale}
                signupButtonLabel={stringTranslations?.signUp ?? "Sign up"}
                readMoreButtonLabel={stringTranslations?.readMore ?? "Read more"}
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
