import { HubspotForm } from "@/components/hubspot/hubspot-form.component";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PageBuilder } from "@/components/page-builder/page-builder.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Img } from "@/components/utils/img.component";
import type { PageQueryResult } from "@/sanity-types";

type ConversionPageData = NonNullable<PageQueryResult> & {
  _type: "conversionPage";
};

export const ConversionPage = (props: Omit<ConversionPageData, "metadata">) => {
  const { hero, contactForm, highlightedClients, highlightedQuotes, pageBuilder } = props;

  // Extract data from hero based on hero type
  const heroData = hero?.mediaHero ?? hero?.stickyHero;
  const title = heroData?.title ?? null;
  const excerpt = hero?.mediaHero?.excerpt ?? hero?.stickyHero?.excerpt ?? null;
  const media = hero?.mediaHero?.media ?? hero?.stickyHero?.media ?? null;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-container-primary py-lg">
        <Container>
          <div className="grid gap-md lg:grid-cols-2 lg:gap-lg">
            {/* Left: Title, Excerpt, Form */}
            <div className="flex flex-col gap-sm">
              {title && <H1>{title}</H1>}

              {excerpt && (
                <div className="text-text-secondary">
                  <PortableText content={excerpt} options={{ pSize: "text-lg" }} />
                </div>
              )}

              {contactForm?.formId && (
                <div className="mt-sm rounded-sm bg-container-secondary p-sm">
                  <HubspotForm formId={contactForm.formId} />
                </div>
              )}
            </div>

            {/* Right: Image (3:4 aspect ratio) */}
            {media?.image && (
              <div className="order-first aspect-3/4 overflow-hidden rounded-sm lg:order-last">
                <Img {...media.image} sizes={{ md: "half" }} cover className="size-full" />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Highlighted Clients */}
      {highlightedClients && highlightedClients.length > 0 && (
        <section className="bg-container-secondary py-md">
          <Container>
            <ul className="flex flex-wrap items-center justify-center gap-sm md:gap-md">
              {highlightedClients.map((client) => (
                <li key={client._id} className="flex items-center justify-center">
                  {client.logo ? (
                    // biome-ignore lint/performance/noImgElement: External URL from Sanity CDN
                    <img
                      src={client.logo}
                      alt={client.name ?? ""}
                      className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:h-10"
                    />
                  ) : (
                    <span className="text-sm text-text-secondary">{client.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Highlighted Quotes */}
      {highlightedQuotes && highlightedQuotes.length > 0 && (
        <section className="bg-container-primary py-lg">
          <Container>
            <div className="grid gap-md md:grid-cols-2 lg:grid-cols-3">
              {highlightedQuotes.map((quote) => (
                <blockquote
                  key={quote._id}
                  className="flex flex-col gap-xs rounded-sm bg-container-secondary p-sm"
                >
                  <p className="text-lg italic text-text-primary">"{quote.quote}"</p>
                  {quote.source && (
                    <footer className="text-sm text-text-secondary">
                      <cite className="not-italic">
                        {quote.source.name}
                        {quote.source.role && <span>, {quote.source.role}</span>}
                      </cite>
                    </footer>
                  )}
                </blockquote>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Page Builder */}
      {pageBuilder && <PageBuilder pageBuilder={pageBuilder} />}
    </>
  );
};
