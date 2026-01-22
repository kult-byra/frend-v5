import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1, H2 } from "@/components/layout/heading.component";
import type {
  KnowledgeHubContentQueryResult,
  KnowledgeHubSettingsQueryResult,
} from "@/sanity-types";
import {
  knowledgeHubContentQuery,
  knowledgeHubSettingsQuery,
} from "@/server/queries/documents/knowledge-hub.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";

type Props = {
  params: Promise<{ locale: string }>;
};

async function getHubSettings(locale: string) {
  const { data } = await sanityFetch({
    query: knowledgeHubSettingsQuery,
    params: { locale },
    tags: ["knowledgeHub"],
  });

  return data as KnowledgeHubSettingsQueryResult;
}

async function getHubContent(locale: string) {
  const { data } = await sanityFetch({
    query: knowledgeHubContentQuery,
    params: { locale },
    tags: ["knowledgeArticle", "caseStudy", "seminar", "eBook"],
  });

  return data as KnowledgeHubContentQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getHubSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function KnowledgeHubPage({ params }: Props) {
  const { locale } = await params;
  const [settings, content] = await Promise.all([getHubSettings(locale), getHubContent(locale)]);

  return (
    <Container className="py-12">
      <H1 className="mb-4">{settings?.title ?? "Kunnskap"}</H1>
      {settings?.subtitle && (
        <p className="text-xl text-muted-foreground mb-8">{settings.subtitle}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <H2>Artikler</H2>
            <Link href="/knowledge/articles" className="text-sm text-primary hover:underline">
              Se alle →
            </Link>
          </div>
          <div className="space-y-3">
            {content?.articles?.map((article) => (
              <Link
                key={article._id}
                href={`/knowledge/${article.slug}`}
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="font-medium">{article.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <H2>Prosjekter</H2>
            <Link href="/projects" className="text-sm text-primary hover:underline">
              Se alle →
            </Link>
          </div>
          <div className="space-y-3">
            {content?.caseStudies?.map((caseStudy) => (
              <Link
                key={caseStudy._id}
                href={`/projects/${caseStudy.slug}`}
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="font-medium">{caseStudy.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <H2>Seminarer</H2>
            <Link href="/seminars" className="text-sm text-primary hover:underline">
              Se alle →
            </Link>
          </div>
          <div className="space-y-3">
            {content?.seminars?.map((seminar) => (
              <Link
                key={seminar._id}
                href={`/seminars/${seminar.slug}`}
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="font-medium">{seminar.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <H2>E-bøker</H2>
            <Link href="/ebooks" className="text-sm text-primary hover:underline">
              Se alle →
            </Link>
          </div>
          <div className="space-y-3">
            {content?.eBooks?.map((eBook) => (
              <Link
                key={eBook._id}
                href={`/ebooks/${eBook.slug}`}
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="font-medium">{eBook.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
