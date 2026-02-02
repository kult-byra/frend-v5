import Link from "next/link";
import { SanityImage } from "sanity-image";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { Media } from "@/components/utils/media.component";
import { env } from "@/env";
import type { ArticleQueryResult } from "@/sanity-types";

// Extract media type from ArticleQueryResult
type ArticleMedia = NonNullable<NonNullable<ArticleQueryResult>["hero"]>["media"];

type ArticleHeroByline = {
  author?: {
    _id: string;
    name: string | null;
    slug?: string | null;
    role?: string | null;
    image?: {
      asset?: { _id: string } | null;
      crop?: { top: number; bottom: number; left: number; right: number } | null;
      hotspot?: { x: number; y: number; height: number; width: number } | null;
    } | null;
  } | null;
  date?: string | null;
};

type ArticleHeroProps = {
  /** Required title */
  title: string;
  /** Type label displayed above the title (e.g., "News", "Article") */
  topTitle?: string;
  /** Sub-heading/excerpt displayed below the title */
  subHeading?: string;
  /** Author and date information */
  byline?: ArticleHeroByline;
  /** Optional media (image/video) */
  media?: ArticleMedia;
};

/**
 * Author byline component showing avatar, name, role
 */
function AuthorByline({ author }: { author: NonNullable<ArticleHeroByline["author"]> }) {
  const authorUrl = author.slug ? `/people/${author.slug}` : null;

  return (
    <div className="flex shrink-0 items-center gap-xs">
      {author.image?.asset?._id && (
        <SanityImage
          id={author.image.asset._id}
          projectId={env.NEXT_PUBLIC_SANITY_PROJECT_ID}
          dataset={env.NEXT_PUBLIC_SANITY_DATASET}
          alt={author.name ?? ""}
          width={53}
          height={53}
          crop={author.image.crop ?? undefined}
          hotspot={author.image.hotspot ?? undefined}
          className="size-[53px] shrink-0 rounded-full object-cover"
        />
      )}
      <div className="flex flex-col gap-3xs">
        {author.name &&
          (authorUrl ? (
            <Link href={authorUrl} className="text-base leading-[145%] text-primary underline">
              {author.name}
            </Link>
          ) : (
            <span className="text-base leading-[145%] text-primary">{author.name}</span>
          ))}
        {author.role && (
          <span className="text-base leading-[145%] text-secondary">{author.role}</span>
        )}
      </div>
    </div>
  );
}

export const ArticleHero = ({ title, topTitle, subHeading, byline, media }: ArticleHeroProps) => {
  const formattedDate = byline?.date
    ? new Date(byline.date).toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : null;

  const hasByline = byline?.author || formattedDate;

  return (
    <section className="bg-container-primary">
      {/* Hero content */}
      <Container>
        <div className="flex gap-xs py-xl">
          {/* Empty cell - takes up left half on desktop */}
          <div className="hidden min-h-px min-w-px flex-1 lg:block" />

          {/* Text cell - full width on mobile, right half on desktop */}
          <div className="flex w-full flex-1 flex-col gap-md pr-0 lg:pr-md">
            <div className="flex max-w-[720px] flex-col gap-sm">
              {/* Top title and main title */}
              <div className="flex flex-col gap-xs">
                {topTitle && (
                  <span className="text-lg leading-[150%] text-secondary">{topTitle}</span>
                )}
                <H1 className="text-[30px] font-semibold leading-[110%] text-primary lg:text-[42px]">
                  {title}
                </H1>
              </div>

              {/* Sub-heading */}
              {subHeading && <p className="text-lg leading-[150%] text-secondary">{subHeading}</p>}
            </div>

            {/* Byline: author and date */}
            {hasByline && (
              <div className="flex w-full flex-wrap items-start justify-between gap-xs lg:gap-sm">
                {/* Author */}
                {byline?.author && (
                  <div className="flex flex-wrap items-start gap-xs lg:gap-lg">
                    <AuthorByline author={byline.author} />
                  </div>
                )}

                {/* Date */}
                {formattedDate && (
                  <span className="shrink-0 text-base leading-[145%] text-primary">
                    {formattedDate}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Media */}
      {media?.mediaType && (
        <Container className="pb-xl">
          <Media
            mediaType={media.mediaType}
            image={media.image}
            videoUrl={media.videoUrl}
            aspectRatio={media.aspectRatio}
            sizes={{ md: "full", xl: "full" }}
            priority
          />
        </Container>
      )}
    </section>
  );
};
