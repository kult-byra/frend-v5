import type { Metadata } from "next";
import { StickyBottomContainer } from "@/components/sticky-bottom-container.component";
import type { ServicesArchiveSettingsQueryResult, ServicesListQueryResult } from "@/sanity-types";
import {
  servicesArchiveSettingsQuery,
  servicesListQuery,
} from "@/server/queries/documents/services-archive.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { AnchorNavigation } from "./(parts)/anchor-navigation.component";
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
      {/* Hero section with mobile anchor nav */}
      <ServicesHero
        title={settings?.title ?? null}
        excerpt={settings?.excerpt ?? null}
        subtitle={settings?.subtitle ?? null}
        media={settings?.media ?? null}
        mobileAnchorNav={<AnchorNavigation items={anchorItems} />}
      />

      {/* Main content area with service sections */}
      <StickyBottomContainer
        stickyContent={<AnchorNavigation items={anchorItems} />}
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
