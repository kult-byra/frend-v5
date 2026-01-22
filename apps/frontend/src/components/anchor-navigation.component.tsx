"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon.component";
import { cn } from "@/utils/cn.util";

export type AnchorItem = {
  label: string;
  anchorId: string;
};

type AnchorNavigationProps = {
  items: AnchorItem[];
  label: string;
};

/**
 * Find the first visible element with the given ID.
 * Handles duplicate IDs from mobile/desktop responsive layouts.
 */
function findVisibleElement(id: string): HTMLElement | null {
  const elements = document.querySelectorAll(`#${CSS.escape(id)}`);
  for (const el of elements) {
    const style = window.getComputedStyle(el);
    if (style.display !== "none" && style.visibility !== "hidden") {
      return el as HTMLElement;
    }
  }
  return null;
}

export function AnchorNavigation({ items, label }: AnchorNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.anchorId ?? null);

  // Track which anchor is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const item of items) {
      const element = findVisibleElement(item.anchorId);
      if (!element) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(item.anchorId);
            }
          }
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
      );

      observer.observe(element);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, [items]);

  const handleClick = (anchorId: string) => {
    const element = findVisibleElement(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[4px] bg-container-secondary">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between pb-2xs pl-xs pr-2xs pt-2xs"
        aria-expanded={isExpanded}
      >
        <span className="pt-3xs text-body-title text-text-primary">{label}</span>
        <Icon
          name={isExpanded ? "collapse" : "expand"}
          className="size-8"
          label={isExpanded ? "Collapse" : "Expand"}
        />
      </button>

      {/* Collapsible list */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <nav className="overflow-hidden">
          <div className="flex flex-col gap-2xs px-xs pb-xs">
            {items.map((item, index) => (
              <button
                key={item.anchorId}
                type="button"
                onClick={() => handleClick(item.anchorId)}
                className={cn(
                  "flex items-start gap-sm text-left text-body transition-colors hover:text-button-secondary-text-hover",
                  activeId === item.anchorId
                    ? "text-button-secondary-text-hover"
                    : "text-text-primary",
                )}
              >
                <span className="w-[22px] shrink-0">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
