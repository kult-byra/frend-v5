import { z } from "zod";
import { Article } from "@/app/[locale]/articles/[slug]/(parts)/article.component";
import { articleQuery, articleSlugsQuery } from "@/server/queries/documents/article.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";

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
      (item): item is { slug: string; locale: string } => item.locale !== null,
    );
  },

  loader: async ({ params }) => {
    const data = await sanityFetch({
      query: articleQuery,
      params: { slug: params.slug, locale: params.locale },
    });

    return data.data;
  },
  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },
  component: ({ data }) => {
    return <Article {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
