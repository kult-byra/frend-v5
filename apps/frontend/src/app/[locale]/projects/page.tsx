import type { Metadata } from "next";
import Link from "next/link";
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

  return (
    <Container className="py-12">
      <H1 className="mb-4">{settings?.title ?? "Prosjekter"}</H1>
      {settings?.subtitle && (
        <p className="text-xl text-muted-foreground mb-8">{settings.subtitle}</p>
      )}

      {caseStudies && caseStudies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy) => (
            <Link
              key={caseStudy._id}
              href={`/projects/${caseStudy.slug}`}
              className="group block p-6 border rounded-lg hover:border-primary transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {caseStudy.title}
              </h2>
              {caseStudy.client?.name && (
                <p className="text-sm text-muted-foreground">{caseStudy.client.name}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Ingen prosjekter funnet.</p>
      )}
    </Container>
  );
}
