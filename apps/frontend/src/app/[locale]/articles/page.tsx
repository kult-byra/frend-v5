import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { articlesParamsCache } from "@/lib/search-params/articles.search-params";
import type { ArticleArchiveSettingsQueryResult } from "@/sanity-types";
import { articleArchiveSettingsQuery } from "@/server/queries/documents/article-archive.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";
import { ArticleArchive } from "./(parts)/article-archive.component";
import { ArticleArchiveSkeleton } from "./(parts)/article-archive-skeleton.component";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

// TODO: Enable when next-sanity supports cache components
// async function getArchiveSettings() {
//   "use cache";
//   cacheLife("hours");
//   ...
// }

async function getArchiveSettings(locale: string) {
  const { data } = await sanityFetch({
    query: articleArchiveSettingsQuery,
    params: { locale },
    tags: ["newsAndEventsArchive"],
  });

  return data as NonNullable<ArticleArchiveSettingsQueryResult>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { page } = await articlesParamsCache.parse(searchParams);
  const settings = await getArchiveSettings(locale);

  const baseTitle = settings?.title ?? "Artikler";
  const title = page > 1 ? `${baseTitle} - Side ${page}` : baseTitle;

  // Get base metadata from Sanity
  const baseMetadata = formatMetadata(settings?.metadata);

  return {
    ...baseMetadata,
    title,
    alternates: {
      canonical: page === 1 ? "/artikler" : `/artikler?page=${page}`,
    },
  };
}

export default async function ArticlesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await articlesParamsCache.parse(searchParams);
  const settings = await getArchiveSettings(locale);

  return (
    <Container className="py-lg">
      <H1 className="mb-8">{settings?.title ?? "Artikler"}</H1>

      {page > 1 && <p className="text-muted-foreground mb-6">Side {page} av artikler</p>}

      <Suspense fallback={<ArticleArchiveSkeleton />}>
        <ArticleArchive initialPage={page} locale={locale} />
      </Suspense>
    </Container>
  );
}
