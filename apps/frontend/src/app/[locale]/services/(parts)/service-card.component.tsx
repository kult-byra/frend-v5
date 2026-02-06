import { toPlainText } from "next-sanity";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { TechnologyPills } from "@/components/technology-pill.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import { Link } from "@/components/utils/link.component";
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
  technologies?: ServiceItem["technologies"];
};

export function ServiceCard({ title, slug, excerpt, media, technologies }: ServiceCardProps) {
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
      href={`/services/${slug}`}
      className="group flex h-full flex-col rounded bg-container-secondary transition-colors hover:bg-container-tertiary-1"
    >
      {/* Mobile/List layout (below lg) */}
      <div className="flex flex-col lg:hidden">
        {/* Row 1: illustration + title */}
        <div className="flex items-center gap-xs p-xs">
          <div className="w-20 shrink-0">
            <MediaContent className="size-full object-contain" />
          </div>
          <h3 className="flex-1 text-headline-3">{title}</h3>
        </div>

        {/* Row 2: excerpt + arrow */}
        <div className="flex items-end justify-end gap-lg p-xs pt-0">
          {excerpt && (
            <p className="flex-1 text-body-small text-text-secondary">{toPlainText(excerpt)}</p>
          )}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white">
            <Icon name="sm-arrow-right" className="size-[10px] text-text-primary" />
          </div>
        </div>

        {/* Row 3: Technology logos */}
        {technologies && technologies.length > 0 && (
          <div className="border-t border-stroke-soft p-xs">
            <TechnologyPills technologies={technologies} />
          </div>
        )}
      </div>

      {/* Desktop/Grid layout (lg and up) */}
      <div className="hidden lg:flex lg:h-full lg:flex-col">
        {/* Illustration - left aligned */}
        <div className="px-xs pb-lg pt-xs">
          <div className="size-2xl">
            <MediaContent className="size-20 object-contain" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-xs p-xs">
          <h3 className="text-headline-3">{title}</h3>
          {excerpt && <p className="text-body text-text-secondary">{toPlainText(excerpt)}</p>}
        </div>

        {/* Spacer grows to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer: Arrow button + Technology pills */}
        <div className="flex items-center gap-xs border-t border-stroke-soft p-xs">
          {/* Arrow button - left aligned, orange background */}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-container-brand-2 transition-colors group-hover:bg-button-primary-hover">
            <Icon
              name="sm-arrow-right"
              className="size-[10px] text-text-primary transition-colors group-hover:text-button-primary-inverted-text"
            />
          </div>

          {/* Technology logos - right aligned */}
          {technologies && technologies.length > 0 && (
            <TechnologyPills
              technologies={technologies}
              className="flex-1 justify-end overflow-hidden"
            />
          )}
        </div>
      </div>
    </Link>
  );
}
