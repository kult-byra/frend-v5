import { toPlainText } from "next-sanity";
import type { ReactNode } from "react";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { Img } from "@/components/utils/img.component";
import type { ServiceQueryResult } from "@/sanity-types";

type Service = NonNullable<ServiceQueryResult>;

type ServiceHeroProps = {
  title: string | null;
  excerpt: Service["excerpt"] | null;
  media: Service["media"] | null;
  mobileAnchorNav?: ReactNode;
};

function MediaCircle({ media }: { media: Service["media"] | null }) {
  if (!media) return null;

  return (
    <div className="flex aspect-square size-[225px] items-center justify-center rounded-full bg-container-tertiary-2">
      {media.mediaType === "illustration" && media.illustration && (
        <Illustration name={media.illustration as IllustrationName} className="size-[74%]" />
      )}
      {media.mediaType === "image" && media.image && (
        <Img {...media.image} sizes={{ md: "third" }} className="size-[74%] object-contain" />
      )}
    </div>
  );
}

export function ServiceHero({ title, excerpt, media, mobileAnchorNav }: ServiceHeroProps) {
  const excerptText = excerpt ? toPlainText(excerpt) : null;

  return (
    <section className="bg-container-primary pb-md pt-xl">
      <div className="mx-auto max-w-[2560px] px-(--margin)">
        {/* Hero layout - 2 column grid on desktop */}
        <div className="grid gap-(--gutter) lg:grid-cols-2">
          {/* Left column: Empty space on desktop for alignment with main content */}
          <div className="hidden lg:block" />

          {/* Right column: Media + Content */}
          <div className="flex flex-col gap-md">
            {/* Media circle */}
            <MediaCircle media={media} />

            {/* Text content */}
            <div className="flex flex-col gap-sm pr-md">
              {title && (
                <h1 className="max-w-[720px] text-headline-1 text-text-primary">{title}</h1>
              )}
              {excerptText && (
                <p className="max-w-[720px] text-body-large text-text-primary">{excerptText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Anchor navigation below hero content */}
        {mobileAnchorNav && <div className="pt-md lg:hidden">{mobileAnchorNav}</div>}
      </div>
    </section>
  );
}
