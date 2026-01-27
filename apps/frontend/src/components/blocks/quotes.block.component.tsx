"use client";

import { useState } from "react";
import { Icon } from "@/components/icon.component";
import { BlockContainer } from "@/components/layout/block-container.component";
import { cn } from "@/utils/cn.util";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type QuotesBlockProps = PageBuilderBlockProps<"quotes.block"> & {
  options?: { layout?: "default" | "fullWidth" };
};

export const QuotesBlock = (props: QuotesBlockProps) => {
  const { quotes, options } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!quotes || quotes.length === 0) return null;

  const validQuotes = quotes.filter((q): q is NonNullable<typeof q> => q !== null);
  if (validQuotes.length === 0) return null;

  const currentQuote = validQuotes[currentIndex];
  const hasMultipleQuotes = validQuotes.length > 1;
  const isFullWidth = options?.layout === "fullWidth";

  const changeQuote = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => setIsAnimating(false), 200);
    }, 200);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? validQuotes.length - 1 : currentIndex - 1;
    changeQuote(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === validQuotes.length - 1 ? 0 : currentIndex + 1;
    changeQuote(newIndex);
  };

  if (!currentQuote) return null;

  const navigationButtons = hasMultipleQuotes && (
    <div className="flex shrink-0 items-center gap-2xs">
      <button
        type="button"
        onClick={goToPrevious}
        className="flex size-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/80"
        aria-label="Previous quote"
      >
        <Icon name="chevron-left" className="size-2" />
      </button>
      <button
        type="button"
        onClick={goToNext}
        className="flex size-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/80"
        aria-label="Next quote"
      >
        <Icon name="chevron-right" className="size-2" />
      </button>
    </div>
  );

  const quoteContent = (
    <div
      className={cn("transition-opacity duration-200", isAnimating ? "opacity-0" : "opacity-100")}
    >
      <p className="max-w-[720px] text-center text-headline-2 text-text-primary">
        "{currentQuote.quote}"
      </p>
    </div>
  );

  const sourceAttribution = currentQuote.source && (
    <p
      className={cn(
        "text-body text-text-secondary transition-opacity duration-200",
        isAnimating ? "opacity-0" : "opacity-100",
      )}
    >
      {currentQuote.source.name}
      {currentQuote.source.role && `, ${currentQuote.source.role}`}
    </p>
  );

  // Full width layout
  // Mobile: author left, arrows right (like half width)
  // Desktop: centered author, centered arrows below
  if (isFullWidth) {
    return (
      <BlockContainer>
        <div className="flex flex-col items-center justify-center gap-xs rounded-3xs bg-container-tertiary-1 px-sm py-md md:px-xl md:pb-md md:pt-xl">
          {/* Quote text */}
          <blockquote className="flex w-full items-center justify-center px-0 pb-sm pt-md md:px-xl md:pb-3xs md:pt-md">
            {quoteContent}
          </blockquote>

          {/* Mobile: author left, arrows right */}
          <div className="flex w-full items-end justify-between md:hidden">
            {sourceAttribution}
            {navigationButtons}
          </div>

          {/* Desktop: centered author, centered arrows */}
          <div className="hidden w-full flex-col items-center gap-xl md:flex">
            {sourceAttribution}
            {navigationButtons}
          </div>
        </div>
      </BlockContainer>
    );
  }

  // Default (half width) layout
  // Author bottom left, arrows bottom right
  return (
    <BlockContainer>
      <div className="flex flex-col gap-xs rounded-3xs bg-container-tertiary-1 p-xs">
        {/* Quote text */}
        <blockquote className="flex w-full items-center justify-center px-xl py-md">
          {quoteContent}
        </blockquote>

        {/* Source and navigation in a row */}
        <div className="flex w-full items-end justify-between">
          {sourceAttribution}
          {navigationButtons}
        </div>
      </div>
    </BlockContainer>
  );
};
