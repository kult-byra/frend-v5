import { z } from "zod";
import { EBook } from "./(parts)/e-book.component";
import { eBookQuery, eBookSlugsQuery } from "@/server/queries/documents/e-book.query";
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
      query: eBookSlugsQuery,
      perspective: "published",
      stega: false,
    });

    return (data ?? []).filter(
      (item): item is { slug: string; locale: string } =>
        item.slug !== null && item.locale !== null,
    );
  },

  loader: async ({ params }) => {
    const { data } = await sanityFetch({
      query: eBookQuery,
      params: { slug: params.slug, locale: params.locale },
    });

    return data;
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    return <EBook {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
