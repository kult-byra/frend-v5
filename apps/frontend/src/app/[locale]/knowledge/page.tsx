import type { Metadata } from "next";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { KnowledgeTeaser, type KnowledgeTeaserData } from "@/components/teasers/knowledge.teaser";
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
    <Container className="py-lg">
      <H1 className="mb-md">{settings?.title ?? "Kunnskap"}</H1>

      <ul className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-3">
        {content?.map((item) => (
          <li key={item._id}>
            <KnowledgeTeaser item={item as KnowledgeTeaserData} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
