import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type {
  KnowledgeArticleArchiveSettingsQueryResult,
  KnowledgeArticleListQueryResult,
} from "@/sanity-types";
import {
  knowledgeArticleArchiveSettingsQuery,
  knowledgeArticleListQuery,
} from "@/server/queries/documents/knowledge-article.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { formatMetadata } from "@/utils/format-metadata.util";

type Props = {
  params: Promise<{ locale: string }>;
};

async function getArchiveSettings(locale: string) {
  const { data } = await sanityFetch({
    query: knowledgeArticleArchiveSettingsQuery,
    params: { locale },
    tags: ["knowledgeArticleArchive"],
  });

  return data as KnowledgeArticleArchiveSettingsQueryResult;
}

async function getArticles(locale: string) {
  const { data } = await sanityFetch({
    query: knowledgeArticleListQuery,
    params: { locale },
    tags: ["knowledgeArticle"],
  });

  return (data ?? []) as KnowledgeArticleListQueryResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getArchiveSettings(locale);

  return formatMetadata(settings?.metadata);
}

export default async function KnowledgeArticlesArchivePage({ params }: Props) {
  const { locale } = await params;
  const [settings, articles] = await Promise.all([getArchiveSettings(locale), getArticles(locale)]);

  return (
    <Container className="py-lg">
      <Link
        href="/knowledge"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til kunnskap
      </Link>

      <H1 className="mb-8">{settings?.title ?? "Kunnskapsartikler"}</H1>

      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`/knowledge/${article.slug}`}
              className="group block p-sm border rounded-lg hover:border-primary transition-colors"
            >
              <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <div className="text-sm text-muted-foreground">
                {article.author?.name && <span>{article.author.name}</span>}
                {article.publishDate && (
                  <time dateTime={article.publishDate} className="ml-2">
                    {new Date(article.publishDate).toLocaleDateString("no-NO")}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Ingen artikler funnet.</p>
      )}
    </Container>
  );
}
