import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { ClientArchiveSettingsQueryResult, ClientListQueryResult } from "@/sanity-types";
import {
  clientArchiveSettingsQuery,
  clientListQuery,
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
    query: clientListQuery,
    params: { locale },
    tags: ["client"],
  });

  return (data ?? []) as ClientListQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  const [settings, clients] = await Promise.all([getArchiveSettings(locale), getClients(locale)]);

  return (
    <Container className="py-12">
      <H1 className="mb-4">{settings?.title ?? "Kunder"}</H1>
      {settings?.subtitle && (
        <p className="text-xl text-muted-foreground mb-8">{settings.subtitle}</p>
      )}

      {clients && clients.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clients.map((client) => (
            <Link
              key={client._id}
              href={`/kunder/${encodeURIComponent(client.name ?? "")}`}
              className="group block p-6 border rounded-lg hover:border-primary transition-colors text-center"
            >
              <h2 className="font-semibold group-hover:text-primary transition-colors">
                {client.name}
              </h2>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Ingen kunder funnet.</p>
      )}
    </Container>
  );
}
