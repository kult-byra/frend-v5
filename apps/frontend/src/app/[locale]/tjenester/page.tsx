import type { Metadata } from "next";
import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Button } from "@/components/ui/button";
import type { ServicesArchiveSettingsQueryResult, ServicesListQueryResult } from "@/sanity-types";
import {
  servicesArchiveSettingsQuery,
  servicesListQuery,
} from "@/server/queries/documents/services-archive.query";
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
  const [settings, services] = await Promise.all([getArchiveSettings(locale), getServices(locale)]);

  const excerptText = settings?.excerpt ? toPlainText(settings.excerpt) : settings?.subtitle;

  return (
    <section className="bg-container-primary pb-(--spacing-xl) pt-0">
      {/* Header section with excerpt and CTA */}
      <div className="grid tablet:grid-cols-2 gap-(--gutter) px-(--margin) pb-(--spacing-xl)">
        <div>{/* Empty left column */}</div>
        <div className="flex flex-col gap-(--gutter)">
          {excerptText && (
            <p className="text-body-large text-text-primary max-w-[720px]">{excerptText}</p>
          )}
          <Button asChild>
            <Link href="/tjenester">All services</Link>
          </Button>
        </div>
      </div>

      {/* Services grid */}
      <div className="px-(--margin)">
        <ServicesList services={services} />
      </div>
    </section>
  );
}
