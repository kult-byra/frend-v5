import type { Metadata } from "next";
import type { ServicesArchiveSettingsQueryResult, ServicesListQueryResult } from "@/sanity-types";
import {
  servicesArchiveSettingsQuery,
  servicesListQuery,
} from "@/server/queries/documents/services-archive.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { AnchorNavigation } from "./(parts)/anchor-navigation.component";
import { ServiceSection } from "./(parts)/service-section.component";
import { ServicesHero } from "./(parts)/services-hero.component";

type Props = {
  params: Promise<{ locale: string }>;
};

async function getArchiveSettings(locale: string) {
  const { data } = await sanityFetch({
    query: servicesArchiveSettingsQuery,
    params: { locale },
    tags: ["servicesArchive"],
  });

  return data as ServicesArchiveSettingsQueryResult;
}

async function getServices(locale: string) {
  const { data } = await sanityFetch({
    query: servicesListQuery,
    params: { locale },
    tags: ["service"],
  });

  return (data ?? []) as ServicesListQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const [settings, services] = await Promise.all([getArchiveSettings(locale), getServices(locale)]);

  // Create anchor items from services
  const anchorItems = services.map((service, index) => ({
    id: `service-${index}`,
    title: service.title ?? "",
  }));

  return (
    <>
      {/* Hero section */}
      <ServicesHero
        title={settings?.title ?? null}
        excerpt={settings?.excerpt ?? null}
        subtitle={settings?.subtitle ?? null}
        media={settings?.media ?? null}
      />

      {/* Main content area with anchor nav and service sections */}
      <div className="relative bg-container-primary">
        {/* Desktop: Anchor navigation - sticky in left column */}
        <div className="absolute left-(--margin) top-[206px] z-10 hidden w-[443px] lg:block">
          <div className="sticky top-4">
            <AnchorNavigation items={anchorItems} />
          </div>
        </div>

        {/* Service sections */}
        <div>
          {services.map((service, index) => (
            <ServiceSection
              key={service._id}
              id={`service-${index}`}
              title={service.title ?? ""}
              slug={service.slug ?? ""}
              excerpt={service.excerpt}
              media={service.media}
              isLast={index === services.length - 1}
            />
          ))}
        </div>
      </div>
    </>
  );
}
