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
};

export const NavBadge = (props: NavBadgeProps) => {
  const { item, isActive = false, onClick, onMouseEnter, notificationCount } = props;

  const baseClassName = cn(
    "cursor-pointer rounded-[4px] px-2 py-1 flex items-center gap-1 text-[16px] leading-[1.45] text-text-primary transition-colors",
    isActive
      ? "bg-light-orange"
      : "bg-container-shade backdrop-blur-[5px] hover:bg-container-shade/80",
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
          <NotificationBadge count={notificationCount} />
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

const NotificationBadge = ({ count }: { count: number }) => (
  <span className="size-5 rounded-full bg-orange text-text-primary text-[12px] leading-[1.45] flex items-center justify-center">
    {count}
  </span>
);
