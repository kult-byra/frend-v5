import { z } from "zod";
import {
  knowledgeArticleQuery,
  knowledgeArticleSlugsQuery,
} from "@/server/queries/documents/knowledge-article.query";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";
import { KnowledgeArticle } from "./(parts)/knowledge-article.component";

const { Page, generateMetadata, generateStaticParams } = createPage({
  params: z.object({
    slug: z.string(),
    locale: z.string(),
  }),

  generateStaticParams: async () => {
    const { data } = await sanityFetch({
      query: knowledgeArticleSlugsQuery,
      perspective: "published",
      stega: false,
    });

    return (data ?? []).filter(
      (item): item is { slug: string; locale: string } =>
        item.slug !== null && item.locale !== null,
    );
  },

  loader: async ({ params }) => {
    const [{ data }, settings] = await Promise.all([
      sanityFetch({
        query: knowledgeArticleQuery,
        params: { slug: params.slug, locale: params.locale },
      }),
      fetchSettings(params.locale),
    ]);

    if (!data) return null;

    return {
      ...data,
      showMoreLabel: settings?.stringTranslations?.showMore ?? "Vis mer",
      showLessLabel: settings?.stringTranslations?.showLess ?? "Vis mindre",
    };
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    return <KnowledgeArticle {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
