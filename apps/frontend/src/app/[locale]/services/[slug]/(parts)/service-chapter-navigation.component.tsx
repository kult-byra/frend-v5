"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon.component";
import { cn } from "@/utils/cn.util";

export type ChapterItem = {
  id: string;
  title: string;
};

type ServiceChapterNavigationProps = {
  items: ChapterItem[];
  label?: string;
};

export function ServiceChapterNavigation({
  items,
  label = "Chapters",
}: ServiceChapterNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track which chapter is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const item of items) {
      const element = document.getElementById(item.id);
      if (!element) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(item.id);
            }
          }
        },
        {
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        },
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

  const handleClick = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded bg-container-secondary">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 pb-2 pt-2"
        aria-expanded={isExpanded}
      >
        <span className="pt-1 text-body-title text-text-primary">{label}</span>
        <Icon
          name={isExpanded ? "collapse" : "expand"}
          className={cn("size-8 transition-transform duration-200", !isExpanded && "rotate-180")}
          label={isExpanded ? "Collapse" : "Expand"}
        />
      </button>

      {/* Links - animated container */}
      <div
        ref={contentRef}
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <nav className="overflow-hidden">
          <div className="flex flex-col gap-2 px-4 pb-4">
            {items.map((item, index) => {
              const number = String(index + 1).padStart(2, "0");
              const isActive = activeId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    "flex items-start gap-2 text-left text-body transition-colors hover:text-button-secondary-text-hover",
                    isActive ? "text-button-secondary-text-hover" : "text-text-primary",
                  )}
                >
                  <span className="w-[22px] shrink-0">{number}</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
