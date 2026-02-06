import { toPlainText } from "next-sanity";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { TechnologyPills } from "@/components/technology-pill.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import { Link } from "@/components/utils/link.component";

type ServiceMedia = {
  mediaType: "image" | "illustration" | null;
  image: ImgProps | null;
  illustration: string | null;
};

type Technology = {
  _id: string;
  title: string;
  logo: string | null;
};

export type ServiceCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  excerpt?: unknown;
  media?: ServiceMedia | null;
  technologies?: Technology[] | null;
};

export const ServicesCards = ({ items }: { items: ServiceCardItem[] }) => (
  <div>
    <ul className="grid grid-cols-1 gap-(--gutter) lg:grid-cols-3">
      {items.map((item) => {
        const excerptText = item.excerpt
          ? toPlainText(item.excerpt as Parameters<typeof toPlainText>[0])
          : null;

        const media = item.media;
        const technologies = item.technologies;

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
          <li key={item._id}>
            <article className="group relative flex h-full flex-col rounded bg-container-secondary transition-colors hover:bg-container-tertiary-1">
              {/* Compact layout (mobile) */}
              <div className="flex flex-col lg:hidden">
                {/* Row 1: illustration + title */}
                <div className="flex items-center gap-4 p-4">
                  <div className="w-20 shrink-0">
                    <MediaContent className="size-full object-contain" />
                  </div>
                  <h3 className="flex-1 text-headline-3">
                    <Link href={`/services/${item.slug}`} className="after:absolute after:inset-0">
                      {item.title}
                    </Link>
                  </h3>
                </div>

                {/* Row 2: excerpt + arrow */}
                <div className="flex items-end justify-end gap-10 p-4 pt-0">
                  {excerptText && (
                    <p className="flex-1 text-body-small text-text-secondary">{excerptText}</p>
                  )}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-container-primary">
                    <Icon name="sm-arrow-right" className="size-[10px] text-text-primary" />
                  </div>
                </div>

                {/* Row 3: Technology pills */}
                {technologies && technologies.length > 0 && (
                  <div className="border-t border-stroke-soft p-4">
                    <TechnologyPills technologies={technologies} />
                  </div>
                )}
              </div>

              {/* Expanded layout (desktop) */}
              <div className="hidden lg:flex lg:h-full lg:flex-col">
                {/* Illustration - left aligned */}
                <div className="px-4 pb-10 pt-4">
                  <div className="size-2xl">
                    <MediaContent className="size-20 object-contain" />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex flex-col gap-4 p-4">
                  <h3 className="text-headline-3">
                    <Link href={`/services/${item.slug}`} className="after:absolute after:inset-0">
                      {item.title}
                    </Link>
                  </h3>
                  {excerptText && <p className="text-body text-text-secondary">{excerptText}</p>}
                </div>

                {/* Spacer grows to push footer to bottom */}
                <div className="flex-1" />

                {/* Footer: Arrow button + Technology pills */}
                <div className="flex items-center gap-4 border-t border-stroke-soft p-4">
                  {/* Arrow button - primary variant */}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-buttons-primary-fill transition-colors group-hover:bg-buttons-primary-fill-hover">
                    <Icon
                      name="sm-arrow-right"
                      className="size-[10px] text-buttons-primary-text transition-colors group-hover:text-text-primary"
                    />
                  </div>

                  {/* Technology pills - right aligned */}
                  {technologies && technologies.length > 0 && (
                    <TechnologyPills
                      technologies={technologies}
                      className="flex-1 justify-end overflow-hidden"
                    />
                  )}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  </div>
);
