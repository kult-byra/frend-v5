"use client";

import { useState } from "react";
import { Icon } from "@/components/icon.component";
import { cn } from "@/utils/cn.util";

type AnchorItem = {
  id: string;
  title: string;
};

type AnchorNavigationProps = {
  items: AnchorItem[];
  label?: string;
  activeId?: string;
};

export function AnchorNavigation({ items, label = "Services", activeId }: AnchorNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="rounded bg-container-secondary">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 pb-2 pt-2"
      >
        <span className="pt-1 text-body-title text-text-primary">{label}</span>
        <Icon
          name={isExpanded ? "collapse" : "expand"}
          className="size-8"
          label={isExpanded ? "Collapse" : "Expand"}
        />
      </button>

      {/* Links */}
      {isExpanded && (
        <nav className="flex flex-col gap-2 px-4 pb-4">
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
        </nav>
      )}
    </div>
  );
}
