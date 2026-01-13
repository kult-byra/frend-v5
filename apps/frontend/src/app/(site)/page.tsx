import { Page as PageComponent } from "@/app/(site)/[slug]/(parts)/page.component";
import { frontPageQuery } from "@/server/queries/documents/front-page.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";

const { Page, metadata } = createPage({
  loader: async () => {
    return await sanityFetch({
      query: frontPageQuery,
    }).then((data) => data.data);
  },

  component: ({ data }) => {
    return <PageComponent {...data} />;
  },
});

export default Page;
export { metadata };
