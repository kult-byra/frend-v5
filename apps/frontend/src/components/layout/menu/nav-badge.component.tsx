"use client";

import Link from "next/link";
import { cn } from "@/utils/cn.util";
import { getLinkHref } from "./link-href.util";
import type { MenuItemProps } from "./menu.types";

type NavBadgeProps = {
  item: MenuItemProps;
  isActive?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  notificationCount?: number;
  inverted?: boolean;
};

export const NavBadge = (props: NavBadgeProps) => {
  const { item, isActive = false, onClick, onMouseEnter, notificationCount, inverted } = props;

  const baseClassName = cn(
    "cursor-pointer rounded-[4px] px-2 py-1 flex items-center gap-1 text-[16px] leading-[1.45] transition-colors",
    isActive
      ? "bg-light-orange text-text-primary"
      : cn(
          inverted ? "text-text-white-primary" : "text-text-primary",
          inverted
            ? "bg-white/15 backdrop-blur-[5px] hover:bg-white/20"
            : "bg-container-shade backdrop-blur-[5px] hover:bg-container-shade/80",
        ),
  );

  // For linkGroups, render as a button that triggers the panel
  if (item.linkType === "linkGroup") {
    return (
      <button
        type="button"
        className={baseClassName}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        aria-expanded={isActive}
      >
        {item.title}
        {notificationCount !== undefined && notificationCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-orange text-[12px] leading-[1.45] text-text-primary">
            {notificationCount}
          </span>
        )}
      </button>
    );
  }

  // For internal/external links, render as a Link
  const href = getLinkHref(item);
  if (!href) return null;

  return (
    <Link href={href} className={baseClassName}>
      {item.title}
    </Link>
  );
};
