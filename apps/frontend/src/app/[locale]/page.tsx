import { z } from "zod";
import { Page as PageComponent } from "@/app/[locale]/[slug]/(parts)/page.component";
import { frontPageQuery } from "@/server/queries/documents/front-page.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";

const { Page, metadata } = createPage({
  params: z.object({
    locale: z.string(),
  }),

  loader: async ({ params }) => {
    return await sanityFetch({
      query: frontPageQuery,
      params: { locale: params.locale },
    }).then((data) => data.data);
  },

  component: ({ data }) => {
    return <PageComponent {...data} />;
  },
});

export default Page;
export { metadata };
