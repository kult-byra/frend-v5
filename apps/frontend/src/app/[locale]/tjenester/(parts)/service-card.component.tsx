import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import type { ServicesListQueryResult } from "@/sanity-types";

type ServiceItem = ServicesListQueryResult[number];

type ServiceMedia = {
  mediaType: "image" | "illustration" | null;
  image: ImgProps | null;
  illustration: string | null;
};

type ServiceCardProps = {
  title: string;
  slug: string;
  excerpt: ServiceItem["excerpt"] | null;
  media: ServiceMedia | null;
};

export function ServiceCard({ title, slug, excerpt, media }: ServiceCardProps) {
  const MediaContent = ({ className }: { className?: string }) => (
    <>
      {media?.mediaType === "image" && media.image && (
        <Img {...media.image} sizes={{ md: "third" }} className={className} />
      )}
      {media?.mediaType === "illustration" && media.illustration && (
        <Illustration name={media.illustration as IllustrationName} className={className} />
      )}
    </>
  );

  return (
    <Link
      href={`/tjenester/${slug}`}
      className="group flex h-full flex-col rounded bg-container-secondary transition-colors hover:bg-container-tertiary-1"
    >
      {/* Mobile/List layout (below lg) */}
      <div className="flex flex-col lg:hidden">
        {/* Top row: illustration + title */}
        <div className="flex items-center gap-4 p-4">
          <div className="size-20 shrink-0">
            <MediaContent className="size-full object-contain" />
          </div>
          <h3 className="text-headline-3">{title}</h3>
        </div>
        {/* Bottom row: excerpt + arrow */}
        <div className="flex items-end gap-10 p-4 pt-0">
          {excerpt && (
            <p className="flex-1 text-body-small text-text-secondary">{toPlainText(excerpt)}</p>
          )}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-container-tertiary-1">
            <Icon name="arrow-right" className="size-[10px] text-text-primary" />
          </div>
        </div>
      </div>

      {/* Desktop/Grid layout (lg and up) */}
      <div className="hidden lg:flex lg:h-full lg:flex-col">
        {/* Illustration - left aligned */}
        <div className="px-4 pb-10 pt-4">
          <div className="size-[120px]">
            <MediaContent className="size-20 object-contain" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h3 className="text-headline-3">{title}</h3>
          {excerpt && <p className="text-body text-text-secondary">{toPlainText(excerpt)}</p>}
        </div>

        {/* Arrow button */}
        <div className="border-t border-stroke-soft p-4">
          <div className="flex size-8 items-center justify-center rounded-full bg-container-brand-1 transition-colors group-hover:bg-button-primary-hover">
            <Icon
              name="arrow-right"
              className="size-[10px] text-white transition-colors group-hover:text-button-primary-inverted-text"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
