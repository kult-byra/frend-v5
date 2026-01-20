import type { Metadata } from "next";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { ServicesArchiveSettingsQueryResult, ServicesListQueryResult } from "@/sanity-types";
import { servicesArchiveSettingsQuery, servicesListQuery } from "@/server/queries/documents/services-archive.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { ServicesList } from "./(parts)/services-list.component";

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
  const [settings, services] = await Promise.all([
    getArchiveSettings(locale),
    getServices(locale),
  ]);

  return (
    <Container className="py-12">
      <H1 className="mb-4">{settings?.title ?? "Tjenester"}</H1>
      {settings?.subtitle && (
        <p className="text-xl text-muted-foreground mb-8">{settings.subtitle}</p>
      )}

      <ServicesList services={services} />
    </Container>
  );
}
