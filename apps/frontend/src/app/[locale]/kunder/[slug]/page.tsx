import { z } from "zod";
import { Client } from "./(parts)/client.component";
import { clientQuery, clientSlugsQuery } from "@/server/queries/documents/client.query";
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
      query: clientSlugsQuery,
      perspective: "published",
      stega: false,
    });

    return (data ?? []).filter(
      (item): item is { slug: string; locale: string } =>
        item.locale !== null && item.slug !== null,
    );
  },

  loader: async ({ params }) => {
    const { data } = await sanityFetch({
      query: clientQuery,
      params: { name: decodeURIComponent(params.slug), locale: params.locale },
    });

    return data;
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    return <Client {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
