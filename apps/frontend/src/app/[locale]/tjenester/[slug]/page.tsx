import { z } from "zod";
import { serviceQuery, serviceSlugsQuery } from "@/server/queries/documents/service.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";
import { Service } from "./(parts)/service.component";

const { Page, generateMetadata, generateStaticParams } = createPage({
  params: z.object({
    slug: z.string(),
    locale: z.string(),
  }),

  generateStaticParams: async () => {
    const { data } = await sanityFetch({
      query: serviceSlugsQuery,
      perspective: "published",
      stega: false,
    });

    // Flatten the slugs array from each document into a single array
    return (data ?? [])
      .flatMap((doc) => doc.slugs ?? [])
      .filter((item) => item !== null && item.slug !== null && item.locale !== null);
  },

  loader: async ({ params }) => {
    const { data } = await sanityFetch({
      query: serviceQuery,
      params: { slug: params.slug, locale: params.locale },
    });

    return data;
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    return <Service {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
