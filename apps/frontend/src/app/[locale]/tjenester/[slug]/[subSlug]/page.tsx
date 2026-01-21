import { z } from "zod";
import {
  subServiceQuery,
  subServiceSlugsQuery,
} from "@/server/queries/documents/sub-service.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";
import { SubService } from "./(parts)/sub-service.component";

const { Page, generateMetadata, generateStaticParams } = createPage({
  params: z.object({
    slug: z.string(),
    subSlug: z.string(),
    locale: z.string(),
  }),

  generateStaticParams: async () => {
    const { data } = await sanityFetch({
      query: subServiceSlugsQuery,
      perspective: "published",
      stega: false,
    });

    return (data ?? []).filter(
      (item): item is { slug: string; subSlug: string; locale: string } =>
        item.slug !== null && item.locale !== null && item.subSlug !== null,
    );
  },

  loader: async ({ params }) => {
    const { data } = await sanityFetch({
      query: subServiceQuery,
      params: { slug: params.subSlug, locale: params.locale },
    });

    return data;
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    return <SubService {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
