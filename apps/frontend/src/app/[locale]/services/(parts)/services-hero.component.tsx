import { toPlainText } from "next-sanity";
import type { ReactNode } from "react";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { Img } from "@/components/utils/img.component";
import type { ServicesArchiveSettingsQueryResult } from "@/sanity-types";

type ArchiveSettings = NonNullable<ServicesArchiveSettingsQueryResult>;

type ServicesHeroProps = {
  title: string | null;
  excerpt: ArchiveSettings["excerpt"] | null;
  media: ArchiveSettings["media"] | null;
  mobileAnchorNav?: ReactNode;
};

export function ServicesHero({ title, excerpt, media, mobileAnchorNav }: ServicesHeroProps) {
  const excerptText = excerpt ? toPlainText(excerpt) : null;

  return (
    <section className="bg-container-primary pb-md pt-xl">
      <div className="mx-auto max-w-[2560px] px-(--margin)">
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
