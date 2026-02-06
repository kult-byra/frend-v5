import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { eventQuery, eventSlugsQuery } from "@/server/queries/documents/event.query";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { sanityFetch } from "@/server/sanity/sanity-live";
import { createPage } from "@/utils/create-page.util";
import { formatMetadata } from "@/utils/format-metadata.util";
import { Event } from "./(parts)/event.component";

const { Page, generateMetadata, generateStaticParams } = createPage({
  params: z.object({
    slug: z.string(),
    locale: z.string(),
  }),

  generateStaticParams: async () => {
    const { data } = await sanityFetch({
      query: eventSlugsQuery,
      perspective: "published",
      stega: false,
    });

    return (data ?? []).filter(
      (item): item is { slug: string; locale: string } =>
        item.slug !== null && item.locale !== null,
    );
  },

  loader: async ({ params }) => {
    const [{ data: event }, settings] = await Promise.all([
      sanityFetch({
        query: eventQuery,
        params: { slug: params.slug, locale: params.locale },
      }),
      fetchSettings(params.locale as Locale),
    ]);

    if (!event) return null;

    const t = settings.stringTranslations;
    return {
      event,
      locale: params.locale as Locale,
      translations: {
        eventLabel: t?.labelEvent ?? "Event",
        aboutEvent: t?.eventAbout ?? "About the event",
        practicalInfo: t?.eventPracticalInfo ?? "Practical info",
        timeAndDate: t?.eventTimeAndDate ?? "Time and date",
        location: t?.eventLocation ?? "Location",
        eventSignUp: t?.eventSignUp ?? "Event sign up",
      },
    };
  },

  metadata: async ({ data }) => {
    return formatMetadata(data.event.metadata);
  },

  component: ({ data }) => {
    return <Event {...data.event} locale={data.locale} translations={data.translations} />;
  },
});

export default Page;

export { generateMetadata, generateStaticParams };
