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

  // Extract title from hero
  const heroTitle = settings?.hero?.textHero?.title ?? settings?.hero?.mediaHero?.title ?? null;

  return (
    <Container className="py-lg">
      <H1 className="mb-4">{heroTitle ?? "E-bøker"}</H1>

      {eBooks && eBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
          {eBooks.map((eBook) => (
            <Link
              key={eBook._id}
              href={`/ebooks/${eBook.slug}`}
              className="group block p-sm border rounded-lg hover:border-primary transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {eBook.title}
              </h2>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Ingen e-bøker funnet.</p>
      )}
    </Container>
  );
}
