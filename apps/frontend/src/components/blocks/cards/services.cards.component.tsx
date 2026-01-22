import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { Img, type ImgProps } from "@/components/utils/img.component";

type ServiceMedia = {
  mediaType: "image" | "illustration" | null;
  image: ImgProps | null;
  illustration: string | null;
};

export type ServiceCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  excerpt?: unknown;
  media?: ServiceMedia | null;
};

export const ServicesCards = ({ items }: { items: ServiceCardItem[] }) => (
  <div className="@container">
    <ul className="grid grid-cols-1 gap-(--gutter) @lg:grid-cols-2 @2xl:grid-cols-3">
      {items.map((item) => {
        const excerptText = item.excerpt
          ? toPlainText(item.excerpt as Parameters<typeof toPlainText>[0])
          : null;

        const media = item.media;

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
          <li key={item._id} className="@container/card">
            <article className="group relative flex h-full flex-col rounded bg-container-secondary transition-colors hover:bg-container-tertiary-1">
              {/* Compact layout (small container) */}
              <div className="flex flex-col @sm/card:hidden">
                {/* Top row: illustration + title */}
                <div className="flex items-center gap-4 p-4">
                  <div className="size-20 shrink-0">
                    <MediaContent className="size-full object-contain" />
                  </div>
                  <h3 className="text-headline-3">
                    <Link href={`/services/${item.slug}`} className="after:absolute after:inset-0">
                      {item.title}
                    </Link>
                  </h3>
                </div>
                {/* Bottom row: excerpt + arrow */}
                <div className="flex items-end gap-10 p-4 pt-0">
                  {excerptText && (
                    <p className="flex-1 text-body-small text-text-secondary">{excerptText}</p>
                  )}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-container-tertiary-1">
                    <Icon name="arrow-right" className="size-[10px] text-text-primary" />
                  </div>
                </div>
              </div>

              {/* Expanded layout (larger container) */}
              <div className="hidden @sm/card:flex @sm/card:h-full @sm/card:flex-col">
                {/* Illustration - left aligned */}
                <div className="px-4 pb-10 pt-4">
                  <div className="size-[120px]">
                    <MediaContent className="size-20 object-contain" />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex flex-1 flex-col gap-4 p-4">
                  <h3 className="text-headline-3">
                    <Link href={`/services/${item.slug}`} className="after:absolute after:inset-0">
                      {item.title}
                    </Link>
                  </h3>
                  {excerptText && <p className="text-body text-text-secondary">{excerptText}</p>}
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
            </article>
          </li>
        );
      })}
    </ul>
  </div>
);
