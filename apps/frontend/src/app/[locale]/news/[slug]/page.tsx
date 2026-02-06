import { z } from "zod";
import { articleQuery, articleSlugsQuery } from "@/server/queries/documents/article.query";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";
import { NewsArticle } from "./(parts)/news-article.component";

const { Page, generateMetadata, generateStaticParams } = createPage({
  params: z.object({
    slug: z.string(),
    locale: z.string(),
  }),

  generateStaticParams: async () => {
    const { data } = await sanityFetch({
      query: articleSlugsQuery,
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
        query: articleQuery,
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
    return <NewsArticle {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
