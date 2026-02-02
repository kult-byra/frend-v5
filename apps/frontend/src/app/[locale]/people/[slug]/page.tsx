import { z } from "zod";
import { personQuery, personSlugsQuery } from "@/server/queries/documents/person.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";
import { Person } from "./(parts)/person.component";

const { Page, generateMetadata, generateStaticParams } = createPage({
  params: z.object({
    slug: z.string(),
    locale: z.string(),
  }),

  generateStaticParams: async () => {
    const { data } = await sanityFetch({
      query: personSlugsQuery,
      perspective: "published",
      stega: false,
    });

    // Generate paths for both locales for each internal person
    const locales = ["no", "en"];
    return (data ?? [])
      .filter((item): item is { slug: string } => item.slug !== null)
      .flatMap((item) => locales.map((locale) => ({ slug: item.slug, locale })));
  },

  loader: async ({ params }) => {
    const { data } = await sanityFetch({
      query: personQuery,
      params: { slug: params.slug, locale: params.locale },
      tags: ["person"],
    });

    return data;
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.metadata);
  },

  component: ({ data }) => {
    return <Person {...data} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
