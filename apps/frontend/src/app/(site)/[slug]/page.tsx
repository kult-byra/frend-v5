import { z } from "zod";
import { Page as PageComponent } from "@/app/(site)/[slug]/(parts)/page.component";
import { pageQuery, pageSlugsQuery } from "@/server/queries/documents/page.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";

const { Page, generateMetadata, generateStaticParams } = createPage({
  params: z.object({
    slug: z.string(),
  }),

  generateStaticParams: async () => {
    const { data } = await sanityFetch({
      query: pageSlugsQuery,
      perspective: "published",
      stega: false,
    });

    return data;
  },

  loader: async ({ params }) => {
    const { data } = await sanityFetch({
      query: pageQuery,
      params,
    });

    return data;
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    return <PageComponent {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
