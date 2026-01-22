import { toPlainText } from "next-sanity";
import type { ReactNode } from "react";
import { Img } from "@/components/utils/img.component";
import type { ServicesArchiveSettingsQueryResult } from "@/sanity-types";

type ArchiveSettings = NonNullable<ServicesArchiveSettingsQueryResult>;

type ServicesHeroProps = {
  title: string | null;
  excerpt: ArchiveSettings["excerpt"] | null;
  subtitle: string | null;
  media: ArchiveSettings["media"] | null;
  mobileAnchorNav?: ReactNode;
};

export function ServicesHero({
  title,
  excerpt,
  subtitle,
  media,
  mobileAnchorNav,
}: ServicesHeroProps) {
  const excerptText = excerpt ? toPlainText(excerpt) : subtitle;

  return (
    <section className="bg-container-primary pb-md pt-xl">
      <div className="mx-auto max-w-[2560px] px-(--margin)">
        {/* Hero header - 2 column grid on desktop */}
        <div className="grid gap-(--gutter) pb-md lg:grid-cols-2">
          {/* Empty left column on desktop */}
          <div className="hidden lg:block" />

          {/* Content column */}
          <div className="flex max-w-[720px] flex-col gap-sm">
            {title && <h1 className="text-headline-1 text-text-primary">{title}</h1>}
            {excerptText && <p className="text-body-large text-text-primary">{excerptText}</p>}
          </div>
        </div>

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
