import { z } from "zod";
import { ConversionPage } from "@/app/[locale]/[slug]/(parts)/conversion-page.component";
import { Page as PageComponent } from "@/app/[locale]/[slug]/(parts)/page.component";
import { Hero } from "@/components/hero/hero.component";
import { pageQuery, pageSlugsQuery } from "@/server/queries/documents/page.query";
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
      query: pageSlugsQuery,
      perspective: "published",
      stega: false,
    });

    return (data ?? []).filter(
      (item): item is { slug: string; locale: string } => item.locale !== null,
    );
  },

  loader: async ({ params }) => {
    const { data } = await sanityFetch({
      query: pageQuery,
      params: { slug: params.slug, locale: params.locale },
    });

    return data;
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    if (data._type === "conversionPage") {
      return <ConversionPage {...data} />;
    }

    return (
      <>
        {data.hero && <Hero hero={data.hero} />}
        <PageComponent {...data} />
      </>
    );
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
