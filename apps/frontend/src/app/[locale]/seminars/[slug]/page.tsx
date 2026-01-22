import { z } from "zod";
import { seminarQuery, seminarSlugsQuery } from "@/server/queries/documents/seminar.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";
import { Seminar } from "./(parts)/seminar.component";

const { Page, generateMetadata, generateStaticParams } = createPage({
  params: z.object({
    slug: z.string(),
    locale: z.string(),
  }),

  generateStaticParams: async () => {
    const { data } = await sanityFetch({
      query: seminarSlugsQuery,
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
      query: seminarQuery,
      params: { slug: params.slug, locale: params.locale },
    });

    return data;
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    return <Seminar {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
