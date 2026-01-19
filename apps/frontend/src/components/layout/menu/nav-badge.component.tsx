"use client";

import Link from "next/link";
import { cn } from "@/utils/cn.util";
import type { MenuItemProps } from "./menu.types";

type NavBadgeProps = {
  item: MenuItemProps;
  isActive?: boolean;
  onClick?: () => void;
  notificationCount?: number;
};

export const NavBadge = (props: NavBadgeProps) => {
  const { item, isActive = false, onClick, notificationCount } = props;

  const baseClassName = cn(
    "backdrop-blur-[5px] rounded px-2 py-1 flex items-center gap-1 text-body text-text-primary transition-colors",
    isActive ? "bg-light-orange" : "bg-container-shade hover:bg-container-shade/80",
  );

  // For linkGroups, render as a button that triggers the panel
  if (item.linkType === "linkGroup") {
    return (
      <button type="button" className={baseClassName} onClick={onClick} aria-expanded={isActive}>
        {item.title}
        {notificationCount !== undefined && notificationCount > 0 && (
          <NotificationBadge count={notificationCount} />
        )}
      </button>
    );
  }

  // For internal/external links, render as a Link
  const href = getHref(item);

  if (!href) return null;

  return (
    <Link href={href} className={baseClassName}>
      {item.title}
    </Link>
  );
};

const NotificationBadge = ({ count }: { count: number }) => (
  <span className="size-5 rounded-full bg-orange text-container-primary text-body-small flex items-center justify-center">
    {count}
  </span>
);

function getHref(item: MenuItemProps): string | null {
  if (item.linkType === "internal" && item.slug) {
    return `/${item.slug}`;
  }
  if (item.linkType === "external" && "url" in item) {
    return item.url;
  }
  return null;
}
