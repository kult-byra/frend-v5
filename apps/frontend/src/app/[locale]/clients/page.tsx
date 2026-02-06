import type { Metadata } from "next";
import { type ClientCardItem, ClientCards } from "@/components/blocks/cards/client.cards.component";
import { Container } from "@/components/layout/container.component";
import type { ClientArchiveSettingsQueryResult } from "@/sanity-types";
import {
  clientArchiveSettingsQuery,
  clientCardsQuery,
} from "@/server/queries/documents/client.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";

type Props = {
  params: Promise<{ locale: string }>;
};

async function getArchiveSettings(locale: string) {
  const { data } = await sanityFetch({
    query: clientArchiveSettingsQuery,
    params: { locale },
    tags: ["clientArchive"],
  });

  return data as ClientArchiveSettingsQueryResult;
}

async function getClients(locale: string) {
  const { data } = await sanityFetch({
    query: clientCardsQuery,
    params: { locale },
    tags: ["client"],
  });

  return (data ?? []) as ClientCardItem[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  const [settings, clients] = await Promise.all([getArchiveSettings(locale), getClients(locale)]);

  // Extract unique industries for filtering
  const allIndustries = [
    ...new Set(clients.flatMap((client) => client.industries ?? []).filter(Boolean)),
  ];

  // Extract title from hero
  const heroTitle = settings?.hero?.mediaHero?.title ?? settings?.hero?.stickyHero?.title ?? null;

  return (
    <Container className="min-h-screen py-lg">
      <ClientCards items={clients} heading={heroTitle ?? "Kunder"} allIndustries={allIndustries} />
    </Container>
  );
}
