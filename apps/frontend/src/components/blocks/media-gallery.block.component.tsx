"use client";

import { useState } from "react";
import { Icon } from "@/components/icon.component";
import type { ImgProps } from "@/components/utils/img.component";
import { type AspectRatio, Media } from "@/components/utils/media.component";
import type { VideoDisplayMode } from "@/components/utils/video.component";
import { cn } from "@/utils/cn.util";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type MediaGalleryBlockProps = PageBuilderBlockProps<"mediaGallery.block">;

type GalleryTypeHalf = "single" | "grid" | "carousel";
type GalleryTypeFull = "mediaFull" | "dynamic" | "doubleStickyFull" | "carouselFull";

type GalleryOptions = {
  width?: "halfWidth" | "fullWidth";
  galleryTypeHalf?: GalleryTypeHalf;
  galleryTypeFull?: GalleryTypeFull;
};

// Use the generated type directly
type MediaItem = NonNullable<MediaGalleryBlockProps["media"]>[number];

export const MediaGalleryBlock = (props: MediaGalleryBlockProps) => {
  const { media } = props;
  // Options and text fields come from query but types may not be generated yet
  const options = (props as unknown as { options?: GalleryOptions }).options;
  const title = (props as unknown as { title?: string }).title;
  const intro = (props as unknown as { intro?: string }).intro;

  if (!media || media.length === 0) return null;

  const isFullWidth = options?.width === "fullWidth";
  const galleryTypeHalf = options?.galleryTypeHalf || "grid";
  const galleryTypeFull = options?.galleryTypeFull || "mediaFull";

  // Full width gallery types
  if (isFullWidth) {
    switch (galleryTypeFull) {
      case "mediaFull":
        return <MediaFullGallery media={media} />;
      case "dynamic":
        return <DynamicFullGallery media={media} />;
      case "doubleStickyFull":
        return <DoubleStickyFullGallery media={media} />;
      case "carouselFull":
        return <CarouselFullGallery media={media} />;
      default:
        return <MediaFullGallery media={media} />;
    }
  }

  // Half width gallery types
  switch (galleryTypeHalf) {
    case "single":
      return <SingleMediaGallery media={media} />;
    case "carousel":
      return <CarouselGallery media={media} />;
    default:
      return <GridGallery media={media} title={title} intro={intro} />;
  }
};

// =============================================================================
// Single Media Gallery (half width)
// =============================================================================

const SingleMediaGallery = ({ media }: { media: MediaItem[] }) => {
  const item = media[0];
  if (!item) return null;

  // Caption may come from asset description or a dedicated caption field
  const caption = item.image?.asset?.description;

  return (
    <div className="my-xl flex flex-col gap-2xs">
      <Media
        mediaType={item.mediaType as "image" | "video"}
        image={item.image as ImgProps | null}
        videoUrl={item.videoUrl}
        videoDisplayMode={item.videoDisplayMode as VideoDisplayMode}
        videoPlaceholder={item.videoPlaceholder}
        aspectRatio={item.aspectRatio as AspectRatio}
        sizes={{ md: "half" }}
        className="rounded"
      />
      {caption && <p className="text-xs leading-[145%] text-text-secondary">{caption}</p>}
    </div>
  );
};

// =============================================================================
// Carousel Gallery (half width)
// =============================================================================

const CarouselGallery = ({ media }: { media: MediaItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  if (media.length === 0) return null;

  const currentItem = media[currentIndex];
  const hasMultipleItems = media.length > 1;

  const changeSlide = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => setIsAnimating(false), 200);
    }, 200);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? media.length - 1 : currentIndex - 1;
    changeSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === media.length - 1 ? 0 : currentIndex + 1;
    changeSlide(newIndex);
  };

  const handleMediaClick = () => {
    if (hasMultipleItems) {
      goToNext();
    }
  };

  if (!currentItem) return null;

  return (
    <div className="relative my-xl">
      {/* Clickable media area - click to go to next */}
      {hasMultipleItems ? (
        <button
          type="button"
          onClick={handleMediaClick}
          className="block w-full text-left"
          aria-label="Next item"
        >
          <div
            className={cn(
              "transition-opacity duration-200",
              isAnimating ? "opacity-0" : "opacity-100",
            )}
          >
            <Media
              mediaType={currentItem.mediaType as "image" | "video"}
              image={currentItem.image as ImgProps | null}
              videoUrl={currentItem.videoUrl}
              videoDisplayMode={currentItem.videoDisplayMode as VideoDisplayMode}
              videoPlaceholder={currentItem.videoPlaceholder}
              aspectRatio={currentItem.aspectRatio as AspectRatio}
              sizes={{ md: "half" }}
              className="rounded"
            />
          </div>
        </button>
      ) : (
        <Media
          mediaType={currentItem.mediaType as "image" | "video"}
          image={currentItem.image as ImgProps | null}
          videoUrl={currentItem.videoUrl}
          videoDisplayMode={currentItem.videoDisplayMode as VideoDisplayMode}
          videoPlaceholder={currentItem.videoPlaceholder}
          aspectRatio={currentItem.aspectRatio as AspectRatio}
          sizes={{ md: "half" }}
          className="rounded"
        />
      )}

      {/* Navigation arrows */}
      {hasMultipleItems && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-end p-2xs lg:p-xs">
          <div className="pointer-events-auto flex gap-2xs">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex size-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/80"
              aria-label="Previous item"
            >
              <Icon name="lg-chevron-left" className="size-2" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="flex size-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/80"
              aria-label="Next item"
            >
              <Icon name="lg-chevron-right" className="size-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Media Full Gallery (full width)
// =============================================================================

const MediaFullGallery = ({ media }: { media: MediaItem[] }) => {
  // Limit to 3 items max
  const displayMedia = media.slice(0, 3);

  // Determine grid columns based on item count
  const gridCols =
    displayMedia.length === 1
      ? "grid-cols-1"
      : displayMedia.length === 2
        ? "grid-cols-1 lg:grid-cols-2"
        : "grid-cols-1 lg:grid-cols-3";

  return (
    <section className="relative my-xl lg:my-xl">
      {/* Full-width media grid */}
      <div className={cn("grid gap-xs", gridCols)}>
        {displayMedia.map((item) => {
          const caption = item.image?.asset?.description;
          return (
            <div key={item._key} className="relative">
              <Media
                mediaType={item.mediaType as "image" | "video"}
                image={item.image as ImgProps | null}
                videoUrl={item.videoUrl}
                videoDisplayMode={item.videoDisplayMode as VideoDisplayMode}
                videoPlaceholder={item.videoPlaceholder}
                aspectRatio={item.aspectRatio as AspectRatio}
                sizes={{ md: displayMedia.length === 1 ? "full" : "half" }}
                className="w-full"
              />
              {caption && (
                <p className="px-xs pt-2xs text-xs leading-[145%] text-text-secondary">{caption}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Widget placeholder - TODO: Implement actual widget */}
      {displayMedia.length === 1 && (
        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto h-full max-w-[1920px] px-xs">
            <div className="flex h-full items-start justify-end pt-xs">
              <div className="pointer-events-auto w-[200px] rounded bg-container-overlay-secondary-1 p-xs text-text-white-primary lg:w-[320px]">
                <div className="flex items-start justify-between">
                  <p className="font-semibold">Widget placeholder</p>
                  <button type="button" className="text-text-white-primary" aria-label="Close">
                    <Icon name="sm-close-thin" size="sm" />
                  </button>
                </div>
                <p className="mt-2xs text-sm text-text-white-secondary">
                  Widget content will be implemented later.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// =============================================================================
// Dynamic Full Gallery (full width)
// Exactly 3 items in a floating/staggered layout
// =============================================================================

const DynamicFullGallery = ({ media }: { media: MediaItem[] }) => {
  const [first, second, third] = media.slice(0, 3);

  if (!first || !second || !third) return null;

  // Very specific layout due to original design requirements from Figma
  return (
    <section className="grid md:grid-cols-3 gap-xs pb-xl">
      <div className="grid grid-cols-4 ">
        <Media
          mediaType={first.mediaType as "image" | "video"}
          image={first.image as ImgProps | null}
          videoUrl={first.videoUrl}
          videoDisplayMode={first.videoDisplayMode as VideoDisplayMode}
          videoPlaceholder={first.videoPlaceholder}
          aspectRatio={first.aspectRatio as AspectRatio}
          className="col-span-2 col-start-2 w-full"
          sizes={{ md: "full" }}
        />
      </div>
      <div className="w-full h-full flex ">
        <Media
          mediaType={second.mediaType as "image" | "video"}
          image={second.image as ImgProps | null}
          videoUrl={second.videoUrl}
          videoDisplayMode={second.videoDisplayMode as VideoDisplayMode}
          videoPlaceholder={second.videoPlaceholder}
          aspectRatio={second.aspectRatio as AspectRatio}
          sizes={{ md: "third" }}
          className="w-full mt-auto"
        />
      </div>
      <div className="grid grid-cols-4 pb-xl">
        <Media
          mediaType={third.mediaType as "image" | "video"}
          image={third.image as ImgProps | null}
          videoUrl={third.videoUrl}
          videoDisplayMode={third.videoDisplayMode as VideoDisplayMode}
          videoPlaceholder={third.videoPlaceholder}
          aspectRatio={third.aspectRatio as AspectRatio}
          sizes={{ md: "third" }}
          className="col-span-3 col-start-2 w-full"
        />
      </div>
    </section>
  );
};

// =============================================================================
// Double Sticky Full Gallery (full width)
// =============================================================================

const DoubleStickyFullGallery = ({ media }: { media: MediaItem[] }) => {
  // Requires exactly 2 items: first is 3:2 (sticky), second is 3:4
  const firstItem = media[0];
  const secondItem = media[1];

  if (!firstItem || !secondItem) return null;

  const firstCaption = firstItem.image?.asset?.description;
  const secondCaption = secondItem.image?.asset?.description;

  return (
    <section className="my-xl lg:my-xl">
      {/* Desktop: Two columns, first is sticky */}
      <div className="hidden gap-xs lg:flex">
        {/* Left column - 3:2 sticky */}
        <div className="sticky top-[60px] flex flex-1 flex-col gap-2xs self-start pt-[60px]">
          <Media
            mediaType={firstItem.mediaType as "image" | "video"}
            image={firstItem.image as ImgProps | null}
            videoUrl={firstItem.videoUrl}
            videoDisplayMode={firstItem.videoDisplayMode as VideoDisplayMode}
            videoPlaceholder={firstItem.videoPlaceholder}
            aspectRatio="3:2"
            sizes={{ md: "half" }}
            className="rounded"
          />
          {firstCaption && (
            <p className="text-xs leading-[145%] text-text-secondary">{firstCaption}</p>
          )}
        </div>

        {/* Right column - 3:4 scrolls normally */}
        <div className="flex flex-1 flex-col gap-2xs pt-[60px]">
          <Media
            mediaType={secondItem.mediaType as "image" | "video"}
            image={secondItem.image as ImgProps | null}
            videoUrl={secondItem.videoUrl}
            videoDisplayMode={secondItem.videoDisplayMode as VideoDisplayMode}
            videoPlaceholder={secondItem.videoPlaceholder}
            aspectRatio="3:4"
            sizes={{ md: "half" }}
            className="rounded"
          />
          {secondCaption && (
            <p className="text-xs leading-[145%] text-text-secondary">{secondCaption}</p>
          )}
        </div>
      </div>

      {/* Mobile: Stacked vertically (no sticky) */}
      <div className="flex flex-col gap-xs pb-xs lg:hidden">
        {/* First - 3:2 */}
        <div className="flex w-full flex-col gap-2xs">
          <Media
            mediaType={firstItem.mediaType as "image" | "video"}
            image={firstItem.image as ImgProps | null}
            videoUrl={firstItem.videoUrl}
            videoDisplayMode={firstItem.videoDisplayMode as VideoDisplayMode}
            videoPlaceholder={firstItem.videoPlaceholder}
            aspectRatio="3:2"
            sizes={{ md: "full" }}
            className="rounded"
          />
          {firstCaption && (
            <p className="text-xs leading-[145%] text-text-secondary">{firstCaption}</p>
          )}
        </div>

        {/* Second - 3:4 */}
        <div className="flex flex-col gap-2xs">
          <Media
            mediaType={secondItem.mediaType as "image" | "video"}
            image={secondItem.image as ImgProps | null}
            videoUrl={secondItem.videoUrl}
            videoDisplayMode={secondItem.videoDisplayMode as VideoDisplayMode}
            videoPlaceholder={secondItem.videoPlaceholder}
            aspectRatio="3:4"
            sizes={{ md: "full" }}
            className="rounded"
          />
          {secondCaption && (
            <p className="text-xs leading-[145%] text-text-secondary">{secondCaption}</p>
          )}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// Carousel Full Gallery (full width)
// =============================================================================

const CarouselFullGallery = ({ media }: { media: MediaItem[] }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3; // Show 3 items at a time on desktop

  if (media.length < 3) return null; // Requires at least 3 items

  const canGoNext = startIndex + visibleCount < media.length;
  const canGoPrev = startIndex > 0;

  const goToNext = () => {
    if (canGoNext) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (canGoPrev) {
      setStartIndex((prev) => prev - 1);
    }
  };

  // Get visible items for desktop (sliding window)
  const visibleMedia = media.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="relative my-xl lg:my-xl">
      {/* Desktop: 3-column grid with navigation */}
      <div className="hidden lg:block">
        <div className="relative">
          <div className="grid grid-cols-3 gap-xs">
            {visibleMedia.map((item) => (
              <Media
                key={item._key}
                mediaType={item.mediaType as "image" | "video"}
                image={item.image as ImgProps | null}
                videoUrl={item.videoUrl}
                videoDisplayMode={item.videoDisplayMode as VideoDisplayMode}
                videoPlaceholder={item.videoPlaceholder}
                aspectRatio="3:4"
                sizes={{ md: "third" }}
                className="rounded"
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-end p-xs">
            <div className="pointer-events-auto flex gap-2xs">
              <button
                type="button"
                onClick={goToPrev}
                disabled={!canGoPrev}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full bg-white transition-colors",
                  canGoPrev ? "hover:bg-white/80" : "opacity-50",
                )}
                aria-label="Previous items"
              >
                <Icon name="lg-chevron-left" className="size-2" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                disabled={!canGoNext}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full bg-white transition-colors",
                  canGoNext ? "hover:bg-white/80" : "opacity-50",
                )}
                aria-label="Next items"
              >
                <Icon name="lg-chevron-right" className="size-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="lg:hidden">
        <div className="relative">
          <div className="-mx-xs flex gap-xs overflow-x-auto px-xs pb-2xs scrollbar-hide">
            {media.map((item) => (
              <div key={item._key} className="w-[296px] shrink-0">
                <Media
                  mediaType={item.mediaType as "image" | "video"}
                  image={item.image as ImgProps | null}
                  videoUrl={item.videoUrl}
                  videoDisplayMode={item.videoDisplayMode as VideoDisplayMode}
                  videoPlaceholder={item.videoPlaceholder}
                  aspectRatio="3:4"
                  sizes={{ md: "half" }}
                  className="rounded"
                />
              </div>
            ))}
          </div>

          {/* Mobile navigation - centered at bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center pb-2xs">
            <div className="pointer-events-auto flex gap-2xs">
              <button
                type="button"
                onClick={goToPrev}
                className="flex size-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/80"
                aria-label="Previous items"
              >
                <Icon name="lg-chevron-left" className="size-2" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="flex size-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/80"
                aria-label="Next items"
              >
                <Icon name="lg-chevron-right" className="size-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// Grid Gallery (half width)
// =============================================================================

type GridGalleryProps = {
  media: MediaItem[];
  title?: string;
  intro?: string;
};

const GridGallery = ({ media, title, intro }: GridGalleryProps) => {
  const hasHeader = title || intro;

  return (
    <div className="my-xl flex flex-col gap-xs">
      {/* Header with title and intro */}
      {hasHeader && (
        <div className="flex flex-col gap-2xs">
          {title && (
            <h3 className="max-w-[720px] text-[20px] font-semibold leading-[130%] text-text-primary">
              {title}
            </h3>
          )}
          {intro && (
            <p className="max-w-[720px] text-base leading-[145%] text-text-primary">{intro}</p>
          )}
        </div>
      )}

      {/* Media grid - 2 columns on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 gap-2xs lg:grid-cols-3 lg:gap-xs">
        {media.map((item) => {
          const caption = item.image?.asset?.description;
          return (
            <div key={item._key} className="flex flex-col gap-2xs">
              <Media
                mediaType={item.mediaType as "image" | "video"}
                image={item.image as ImgProps | null}
                videoUrl={item.videoUrl}
                videoDisplayMode={item.videoDisplayMode as VideoDisplayMode}
                videoPlaceholder={item.videoPlaceholder}
                aspectRatio="3:4"
                sizes={{ md: "third" }}
                className="rounded"
              />
              {caption && (
                <p className="pb-xs text-xs leading-[145%] text-text-secondary">{caption}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
