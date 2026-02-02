import { toPlainText } from "next-sanity";
import type { ReactNode } from "react";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { Img } from "@/components/utils/img.component";
import type { HeroData } from "@/server/queries/utils/hero.query";

type ServicesHeroProps = {
  hero: HeroData | null;
  mobileAnchorNav?: ReactNode;
};

export function ServicesHero({ hero, mobileAnchorNav }: ServicesHeroProps) {
  // Extract data from hero based on hero type
  const heroData = hero?.mediaHero ?? hero?.textHero;
  const title = heroData?.title ?? null;
  const excerpt = hero?.mediaHero?.excerpt ?? hero?.textHero?.excerpt ?? null;
  const media = hero?.mediaHero?.media ?? null;
  const excerptText = excerpt ? toPlainText(excerpt) : null;

  return (
    <section className="bg-container-primary pb-md pt-xl">
      <div className="mx-auto max-w-[1920px] px-(--margin)">
        <ContentLayout className="pb-md">
          <div className="flex max-w-[720px] flex-col gap-sm">
            {title && <h1 className="text-headline-1 text-text-primary">{title}</h1>}
            {excerptText && <p className="text-body-large text-text-primary">{excerptText}</p>}
          </div>
        </ContentLayout>

        {/* Mobile: Anchor navigation between excerpt and image */}
        {mobileAnchorNav && <div className="pb-md lg:hidden">{mobileAnchorNav}</div>}

        {/* Full width hero image */}
        {media?.mediaType === "image" && media.image && (
          <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded">
            <Img {...media.image} sizes={{ md: "full" }} className="h-full w-auto" />
          </div>
        )}
      </div>
    </section>
  );
}
