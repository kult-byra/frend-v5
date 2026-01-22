import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { EBookArchiveSettingsQueryResult, EBookListQueryResult } from "@/sanity-types";
import { eBookArchiveSettingsQuery, eBookListQuery } from "@/server/queries/documents/e-book.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";

type Props = {
  params: Promise<{ locale: string }>;
};

async function getArchiveSettings(locale: string) {
  const { data } = await sanityFetch({
    query: eBookArchiveSettingsQuery,
    params: { locale },
    tags: ["eBookArchive"],
  });

  return data as EBookArchiveSettingsQueryResult;
}

async function getEBooks(locale: string) {
  const { data } = await sanityFetch({
    query: eBookListQuery,
    params: { locale },
    tags: ["eBook"],
  });

  return (data ?? []) as EBookListQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function EBooksPage({ params }: Props) {
  const { locale } = await params;
  const [settings, eBooks] = await Promise.all([getArchiveSettings(locale), getEBooks(locale)]);

  return (
    <Container className="py-12">
      <H1 className="mb-4">{settings?.title ?? "E-bøker"}</H1>
      {settings?.subtitle && (
        <p className="text-xl text-muted-foreground mb-8">{settings.subtitle}</p>
      )}

      {eBooks && eBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eBooks.map((eBook) => (
            <Link
              key={eBook._id}
              href={`/ebooks/${eBook.slug}`}
              className="group block p-6 border rounded-lg hover:border-primary transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {eBook.title}
              </h2>
              {eBook.subtitle && (
                <p className="text-muted-foreground line-clamp-3">{eBook.subtitle}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Ingen e-bøker funnet.</p>
      )}
    </Container>
  );
}
