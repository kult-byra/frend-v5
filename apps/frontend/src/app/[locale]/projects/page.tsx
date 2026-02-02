import type { Metadata } from "next";
import { CaseStudyCards } from "@/components/blocks/cards/case-study.cards.component";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { CaseStudyArchiveSettingsQueryResult, CaseStudyListQueryResult } from "@/sanity-types";
import {
  caseStudyArchiveSettingsQuery,
  caseStudyListQuery,
} from "@/server/queries/documents/case-study.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";

type Props = {
  params: Promise<{ locale: string }>;
};

async function getArchiveSettings(locale: string) {
  const { data } = await sanityFetch({
    query: caseStudyArchiveSettingsQuery,
    params: { locale },
    tags: ["caseStudyArchive"],
  });

  return data as CaseStudyArchiveSettingsQueryResult;
}

async function getCaseStudies(locale: string) {
  const { data } = await sanityFetch({
    query: caseStudyListQuery,
    params: { locale },
    tags: ["caseStudy"],
  });

  return (data ?? []) as CaseStudyListQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function CaseStudiesPage({ params }: Props) {
  const { locale } = await params;
  const [settings, caseStudies] = await Promise.all([
    getArchiveSettings(locale),
    getCaseStudies(locale),
  ]);

  // Extract title from hero
  const heroTitle = settings?.hero?.textHero?.title ?? settings?.hero?.mediaHero?.title ?? null;

  return (
    <Container className="py-lg">
      <H1 className="mb-4">{heroTitle ?? "Prosjekter"}</H1>

      {caseStudies && caseStudies.length > 0 ? (
        <CaseStudyCards items={caseStudies} />
      ) : (
        <p className="text-muted-foreground">Ingen prosjekter funnet.</p>
      )}
    </Container>
  );
}
