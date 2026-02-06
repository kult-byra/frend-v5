import Link from "next/link";
import { SanityImage } from "sanity-image";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { type AspectRatio, Media } from "@/components/utils/media.component";
import type { VideoDisplayMode } from "@/components/utils/video.component";
import { env } from "@/env";
import type { ArticleQueryResult } from "@/sanity-types";
import type { ArticleHeroData } from "@/server/queries/utils/hero.query";
import { cn } from "@/utils/cn.util";

// Extract media array type from ArticleQueryResult (flat hero structure)
type ArticleMediaItem = NonNullable<
  NonNullable<NonNullable<ArticleQueryResult>["hero"]>["media"]
>[number];

// More flexible media type for use by other components (e.g., case studies)
type FlexibleMediaItem = {
  _key: string;
  mediaType?: "image" | "video" | "illustration" | null;
  image?: ArticleMediaItem["image"];
  videoUrl?: string | null;
  videoDisplayMode?: VideoDisplayMode | null;
  videoPlaceholder?: ArticleMediaItem["videoPlaceholder"];
  aspectRatio?: AspectRatio | null;
};

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

export type ArticleHeroColorScheme = "white" | "navy" | "yellow";

const colorStyles: Record<ArticleHeroColorScheme, { title: string; subtitle: string }> = {
  white: {
    title: "text-text-primary",
    subtitle: "text-text-secondary",
  },
  navy: {
    title: "text-text-white-primary",
    subtitle: "text-text-white-secondary",
  },
  yellow: {
    title: "text-text-primary",
    subtitle: "text-text-secondary",
  },
};

type ArticleHeroProps = {
  /** Required title */
  title: string;
  /** Label displayed above the title (e.g., "News", "Case Study") */
  label?: string | null;
  /** Subheading displayed below the title */
  subheading?: string | null;
  /** Excerpt/description as PortableText (from hero queries) */
  excerpt?: ArticleHeroData["excerpt"];
  /** Author and date information */
  byline?: ArticleHeroByline | null;
  /** Optional cover media (single image/video). Accepts flexible media types. */
  media?: (ArticleMediaItem | FlexibleMediaItem)[] | null;
  /** Color scheme - affects text colors. Defaults to "white" */
  colorScheme?: ArticleHeroColorScheme;
  /** Whether to use transparent background (for scroll-fade effect) */
  transparentBg?: boolean;
  /** Whether to extend hero behind header (adds negative margin and padding) */
  extendBehindHeader?: boolean;
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
            <Link
              href={authorUrl}
              className="border-b border-stroke-soft text-base leading-[145%] text-primary hover:text-button-secondary-text-hover"
            >
              {author.name}
            </Link>
          ) : (
            <span className="border-b border-stroke-soft text-base leading-[145%] text-primary">
              {author.name}
            </span>
          ))}
        {author.role && (
          <span className="text-base leading-[145%] text-secondary">{author.role}</span>
        )}
      </div>
    </div>
  );
}

export const ArticleHero = ({
  title,
  label,
  subheading,
  excerpt,
  byline,
  media,
  colorScheme = "white",
  transparentBg = false,
  extendBehindHeader = false,
}: ArticleHeroProps) => {
  const formattedDate = byline?.date
    ? new Date(byline.date).toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : null;

  const hasByline = byline?.author || formattedDate;
  const colors = colorStyles[colorScheme];

  return (
    <section
      className={cn(
        transparentBg ? "bg-transparent" : "bg-container-primary",
        extendBehindHeader && "-mt-14 pt-14",
      )}
    >
      {/* Hero content */}
      <Container>
        <div className="flex gap-xs py-xl">
          {/* Empty cell - takes up left half on desktop */}
          <div className="hidden min-h-px min-w-px flex-1 lg:block" />

          {/* Text cell - full width on mobile, right half on desktop */}
          <div className="flex w-full flex-1 flex-col gap-md pr-0 lg:pr-md">
            <div className="flex max-w-[720px] flex-col gap-sm">
              {/* Label and main title */}
              <div className="flex flex-col gap-xs">
                {label && (
                  <span className={cn("text-lg leading-[150%]", colors.subtitle)}>{label}</span>
                )}
                <H1
                  className={cn(
                    "text-[30px] font-semibold leading-[110%] lg:text-[42px]",
                    colors.title,
                  )}
                >
                  {title}
                </H1>
                {subheading && (
                  <span className={cn("text-lg leading-[150%]", colors.subtitle)}>
                    {subheading}
                  </span>
                )}
              </div>

              {/* Excerpt (PortableText) */}
              {excerpt && (
                <div className={cn("text-lg leading-[150%]", colors.title)}>
                  <PortableText content={excerpt} />
                </div>
              )}
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
                  <span className={cn("shrink-0 text-base leading-[145%]", colors.title)}>
                    {formattedDate}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Media - renders up to 2 items in a column */}
      {media && media.length > 0 && media[0]?.mediaType && (
        <Container className="pb-xl">
          <div className="flex flex-col gap-md">
            {media.map((item, index) =>
              item.mediaType ? (
                <Media
                  key={item._key}
                  constrainHeight
                  mediaType={item.mediaType}
                  image={item.image}
                  videoUrl={item.videoUrl}
                  videoDisplayMode={item.videoDisplayMode}
                  videoPlaceholder={item.videoPlaceholder}
                  aspectRatio={item.aspectRatio}
                  sizes={{ md: "full", xl: "full" }}
                  priority={index === 0}
                />
              ) : null,
            )}
          </div>
        </Container>
      )}
    </section>
  );
};
