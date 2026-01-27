import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { VisualEditing } from "next-sanity/visual-editing";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import { ClientWrapper } from "@/components/client-wrapper.component";
import { FathomBase } from "@/components/fathom/fathom-base.component";
import { Footer } from "@/components/layout/footer.component";
import { Header } from "@/components/layout/header.component";
import { PreloadResources } from "@/components/preload-resources.component";
import { DraftmodeBanner } from "@/components/utils/draft-mode.component";
import { TailwindIndicator } from "@/components/utils/tailwind-indicator.component";
import { HeaderThemeProvider } from "@/context/header-theme.context";
import { type Locale, routing } from "@/i18n/routing";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { SanityLive } from "@/server/sanity/sanity-live";
import { cn } from "@/utils/cn.util";

import { dmMono, suisseIntl } from "../layout";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const settings = await fetchSettings(locale as Locale);

  return (
    <html lang={locale} className={cn(suisseIntl.variable, dmMono.variable)}>
      <body>
        <NuqsAdapter>
          <NextIntlClientProvider messages={messages}>
            <a
              className="skip-main"
              href="#main"
              aria-label={
                (messages.common as Record<string, string>)?.skipToMain || "Skip to main content"
              }
            >
              {(messages.common as Record<string, string>)?.skipToMain || "Skip to main content"}
            </a>
            <ClientWrapper>
              <HeaderThemeProvider>
                <PreloadResources />
                <div className="flex min-h-screen flex-col">
                  <Header {...settings} />

                  {(await draftMode()).isEnabled && <DraftmodeBanner />}

                  <main id="main" className="mb-auto pt-14">
                    {children}
                  </main>

                  <Footer {...settings} />
                </div>
                <TailwindIndicator />

                <Suspense>
                  <FathomBase />
                </Suspense>
              </HeaderThemeProvider>
            </ClientWrapper>
          </NextIntlClientProvider>
          {(await draftMode()).isEnabled && <VisualEditing />}
          <SanityLive />
        </NuqsAdapter>
      </body>
    </html>
  );
}
