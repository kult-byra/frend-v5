import type { Metadata } from "next";
import { AnchorNavigation } from "@/components/anchor-navigation.component";
import { StickyBottomContainer } from "@/components/sticky-bottom-container.component";
import type { ServicesArchiveSettingsQueryResult, ServicesListQueryResult } from "@/sanity-types";
import {
  servicesArchiveSettingsQuery,
  servicesListQuery,
} from "@/server/queries/documents/services-archive.query";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { ServiceSection } from "./(parts)/service-section.component";
import { ServicesDesktopLayout } from "./(parts)/services-desktop-layout.component";
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
  const archiveSettings = await getArchiveSettings(locale);

  return formatMetadata(archiveSettings?.metadata);
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const [archiveSettings, services, settings] = await Promise.all([
    getArchiveSettings(locale),
    getServices(locale),
    fetchSettings(locale),
  ]);

  const anchorLabel = settings?.stringTranslations?.navServices ?? "Services";

  // Create anchor items from services
  const anchorItems = services.map((service, index) => ({
    anchorId: `service-${index}`,
    label: service.title ?? "",
  }));

  return (
    <>
      {/* Hero section with mobile anchor nav */}
      <ServicesHero
        title={archiveSettings?.title ?? null}
        excerpt={archiveSettings?.excerpt ?? null}
        media={archiveSettings?.media ?? null}
        mobileAnchorNav={<AnchorNavigation items={anchorItems} label={anchorLabel} />}
      />

      {/* Main content area with service sections */}
      <StickyBottomContainer
        stickyContent={<AnchorNavigation items={anchorItems} label={anchorLabel} />}
        className="bg-container-primary"
      >
        {/* Mobile layout - individual sections */}
        {services.map((service, index) => (
          <ServiceSection
            key={service._id}
            id={`service-${index}`}
            title={service.title ?? ""}
            slug={service.slug ?? ""}
            excerpt={service.excerpt}
            media={service.media}
            technologies={service.technologies}
            isLast={index === services.length - 1}
          />
        ))}

        {/* Desktop layout - single sticky illustration with scrolling content */}
        <ServicesDesktopLayout services={services} />
      </StickyBottomContainer>
    </>
  );
}
