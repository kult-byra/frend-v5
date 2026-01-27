"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn.util";

type StickyBottomContainerProps = {
  children: ReactNode;
  stickyContent: ReactNode;
  className?: string;
};

/**
 * A container that keeps content fixed to the bottom-left of the viewport
 * while scrolling, then sticks to the container bottom when reaching the end.
 *
 * Uses IntersectionObserver for performant scroll detection.
 */
export function StickyBottomContainer({
  children,
  stickyContent,
  className,
}: StickyBottomContainerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        // When sentinel is visible, content should stick to container (absolute)
        // When sentinel is not visible, content should be fixed to viewport
        setIsStuck(entry.isIntersecting);
      },
      {
        rootMargin: "0px 0px 16px 0px",
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Sticky content - desktop only */}
      <div
        className={cn(
          "bottom-4 z-10 hidden w-[443px] lg:block",
          isStuck
            ? "absolute left-(--margin)"
            : "fixed left-[max(var(--margin),calc(50vw-960px+var(--margin)))]",
        )}
      >
        {stickyContent}
      </div>

      {/* Main content */}
      <div>{children}</div>

      {/* Sentinel element to detect container bottom */}
      <div ref={sentinelRef} className="absolute bottom-0 h-px w-px" aria-hidden="true" />
    </div>
  );
}
