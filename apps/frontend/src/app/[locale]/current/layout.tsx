import type { ReactNode } from "react";
import { Container } from "@/components/layout/container.component";
import type { Locale } from "@/i18n/routing";
import { fetchSettings } from "@/server/queries/settings/settings.query";
import { CurrentNavigation } from "./(parts)/current-navigation.component";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function CurrentLayout({ children, params }: Props) {
  const { locale } = await params;
  const settings = await fetchSettings(locale as Locale);
  const stringTranslations = settings.stringTranslations;

  return (
    <Container className="flex min-h-screen flex-col py-md">
      <div className="flex flex-col gap-md pb-xs pt-md">
        <CurrentNavigation
          translations={{
            news: stringTranslations?.news,
            events: stringTranslations?.events,
          }}
        />
        {children}
      </div>
    </Container>
  );
}
