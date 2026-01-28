import { resolvePath } from "@workspace/routing/src/resolve-path";
import Link from "next/link";
import type { NewsTeaserProps } from "@/server/queries/teasers/news-teaser.query";
import { Img } from "../utils/img.component";

type Props = {
  item: NewsTeaserProps;
  typeLabel?: string | null;
  locale?: string;
};

function formatDate(dateString: string | null, locale: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString(locale === "no" ? "nb-NO" : "en-US", options);
}

export function NewsTeaser({ item, typeLabel, locale = "no" }: Props) {
  const { title, slug, image, publishDate, services } = item;
  const href = resolvePath("newsArticle", { slug });

  return (
    <article className="group relative flex flex-col gap-xs pb-xs">
      {/* Image with service pills overlay */}
      <div className="relative aspect-3/4 overflow-hidden rounded-xs">
        {image?.asset && <Img {...image} sizes={{ md: "third" }} className="h-full w-full" cover />}

        {/* Service pills - positioned at bottom of image */}
        {services && services.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-3xs p-xs">
            {services.map((service) => (
              <span
                key={service._id}
                className="flex h-8 items-center justify-center rounded-full bg-container-secondary px-xs text-xs leading-[1.45] text-text-primary"
              >
                {service.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-2xs pr-xs">
        {/* Type label */}
        {typeLabel && (
          <span className="text-xs leading-[1.45] text-text-secondary">{typeLabel}</span>
        )}

        {/* Title with link */}
        <h3 className="max-w-[420px] text-lg leading-normal text-text-primary">
          <Link href={href} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>

        {/* Date */}
        {publishDate && (
          <time className="text-xs leading-[1.45] text-text-secondary" dateTime={publishDate}>
            {formatDate(publishDate, locale)}
          </time>
        )}
      </div>
    </article>
  );
}
