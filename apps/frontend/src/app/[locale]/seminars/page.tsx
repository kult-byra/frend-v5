import type { Metadata } from "next";
import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { SeminarArchiveSettingsQueryResult, SeminarListQueryResult } from "@/sanity-types";
import {
  seminarArchiveSettingsQuery,
  seminarListQuery,
} from "@/server/queries/documents/seminar.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";

type Props = {
  params: Promise<{ locale: string }>;
};

async function getArchiveSettings(locale: string) {
  const { data } = await sanityFetch({
    query: seminarArchiveSettingsQuery,
    params: { locale },
    tags: ["seminarArchive"],
  });

  return data as SeminarArchiveSettingsQueryResult;
}

async function getSeminars(locale: string) {
  const { data } = await sanityFetch({
    query: seminarListQuery,
    params: { locale },
    tags: ["seminar"],
  });

  return (data ?? []) as SeminarListQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function SeminarsPage({ params }: Props) {
  const { locale } = await params;
  const [settings, seminars] = await Promise.all([getArchiveSettings(locale), getSeminars(locale)]);

  // Extract title from hero
  const heroTitle = settings?.hero?.textHero?.title ?? settings?.hero?.mediaHero?.title ?? null;

  return (
    <Container className="py-lg">
      <H1 className="mb-4">{heroTitle ?? "Seminarer"}</H1>

      {seminars && seminars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
          {seminars.map((seminar) => (
            <Link
              key={seminar._id}
              href={`/seminars/${seminar.slug}`}
              className="group block p-sm border rounded-lg hover:border-primary transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {seminar.title}
              </h2>
              {seminar.excerpt && (
                <p className="text-muted-foreground line-clamp-3">{toPlainText(seminar.excerpt)}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Ingen seminarer funnet.</p>
      )}
    </Container>
  );
}
