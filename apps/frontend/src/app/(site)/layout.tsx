import { draftMode } from "next/headers";
import { type PropsWithChildren, Suspense } from "react";
import { ClientWrapper } from "@/components/client-wrapper.component";
import { FathomBase } from "@/components/fathom/fathom-base.component";
import { Footer } from "@/components/layout/footer.component";
import { Header } from "@/components/layout/header.component";
import { PreloadResources } from "@/components/preload-resources.component";
import { DraftmodeBanner } from "@/components/utils/draft-mode.component";
import { TailwindIndicator } from "@/components/utils/tailwind-indicator.component";
import { fetchSettings } from "@/server/queries/settings/settings.query";

const SiteLayout = async ({ children }: PropsWithChildren) => {
  const settings = await fetchSettings();

  return (
    <ClientWrapper>
      <PreloadResources />
      <div className="flex min-h-screen flex-col">
        <Header {...settings} />

        {(await draftMode()).isEnabled && <DraftmodeBanner />}

        <main id="main" className="mb-auto">
          {children}
        </main>

        <Footer {...settings} />
      </div>
      <TailwindIndicator />

      <Suspense>
        <FathomBase />
      </Suspense>
    </ClientWrapper>
  );
};

export default SiteLayout;
