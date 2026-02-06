"use client";

import { type ReactNode, useCallback, useState } from "react";
import { useEventListener } from "@/hooks/use-event-listener.hook";
import { cn } from "@/utils/cn.util";

type ScrollFadeBackgroundProps = {
  children: ReactNode;
  /** Tailwind background class for the initial color */
  bgClass: string;
  /** Scroll position in pixels where the fade triggers */
  threshold?: number;
  className?: string;
};

/**
 * A wrapper that provides a full-page background color that fades to white
 * when the user scrolls past a threshold.
 */
export function ScrollFadeBackground({
  children,
  bgClass,
  threshold = 200,
  className,
}: ScrollFadeBackgroundProps) {
  const [hasFaded, setHasFaded] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setHasFaded(scrollY > threshold);
  }, [threshold]);

  useEventListener("scroll", handleScroll);

  return (
    <div className={cn("relative", className)}>
      {/* Fixed background layer that fades out */}
      <div
        className={cn(
          bgClass,
          "pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500 ease-out",
          hasFaded && "opacity-0",
        )}
        aria-hidden="true"
      />

      {/* Content */}
      {children}
    </div>
  );
}
