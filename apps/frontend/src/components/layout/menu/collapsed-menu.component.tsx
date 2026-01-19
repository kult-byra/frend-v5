"use client";

import { resolvePath } from "@workspace/routing/src/resolve-path";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LinkGroupProps, MainMenuProps, SecondaryMenuProps } from "./menu.types";
import { NavBadge } from "./nav-badge.component";

type CollapsedMenuProps = {
  mainMenu: MainMenuProps;
  secondaryMenu: SecondaryMenuProps;
  newsEventsCount: number;
};

export const CollapsedMenu = (props: CollapsedMenuProps) => {
  const { mainMenu, secondaryMenu, newsEventsCount } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Find the active link group
  const activeLinkGroup = mainMenu?.find(
    (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activeCategory,
  );

  // Set first linkGroup as default when opening
  const handleOpen = () => {
    setIsOpen(true);
    const firstLinkGroup = mainMenu?.find((item) => item.linkType === "linkGroup");
    if (firstLinkGroup) {
      setActiveCategory(firstLinkGroup._key);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveCategory(null);
  };

  const mainLinks = activeLinkGroup?.links?.mainLinks ?? [];
  const linkGroupSecondaryLinks = activeLinkGroup?.links?.secondaryLinks ?? [];

  return (
    <div className="menu:hidden">
      {/* Menu trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Åpne meny"
        className="backdrop-blur-[5px] bg-container-shade rounded px-2 py-1 text-body text-text-primary"
      >
        Meny
      </button>

      {/* Fullscreen overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-light-purple flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 h-[52px]">
            <Link href="/" onClick={handleClose} className="font-semibold text-lg">
              frend
            </Link>
            <div className="flex items-center gap-4">
              {/* Contact badge */}
              <Link
                href="/kontakt"
                onClick={handleClose}
                className="backdrop-blur-[5px] bg-container-shade rounded px-2 py-1 text-body text-text-primary"
              >
                Contact
              </Link>
              {/* Close button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Lukk meny"
                className="size-8 flex items-center justify-center"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Category badges row */}
          <div className="flex items-center gap-2 px-4 py-2 border-y border-stroke-soft overflow-x-auto">
            {mainMenu?.map((item) => {
              if (item.linkType !== "linkGroup") return null;
              return (
                <NavBadge
                  key={item._key}
                  item={item}
                  isActive={activeCategory === item._key}
                  onClick={() => setActiveCategory(item._key)}
                  notificationCount={
                    item.menuType === "newsAndEvents" ? newsEventsCount : undefined
                  }
                />
              );
            })}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-10 px-4 py-6">
              {/* Main links - large headings */}
              {mainLinks.length > 0 && (
                <div className="flex flex-col gap-4">
                  {mainLinks.map((link) => {
                    const href = getLinkHref(link);
                    if (!href) return null;
                    return (
                      <Link
                        key={link._key}
                        href={href}
                        onClick={handleClose}
                        className="text-headline-2 text-text-primary py-2"
                      >
                        {link.title}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Link group secondary links */}
              {linkGroupSecondaryLinks.length > 0 && (
                <div className="flex flex-col gap-2">
                  {linkGroupSecondaryLinks.map((link) => {
                    const href = getLinkHref(link);
                    if (!href) return null;
                    return (
                      <Link
                        key={link._key}
                        href={href}
                        onClick={handleClose}
                        className="text-body-large text-text-primary py-2"
                      >
                        {link.title}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Secondary menu items (About us, Careers, etc.) */}
              {secondaryMenu && secondaryMenu.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-stroke-soft pt-6">
                  {secondaryMenu.map((item) => {
                    const href = getMenuItemHref(item);
                    if (!href) return null;
                    return (
                      <Link
                        key={item._key}
                        href={href}
                        onClick={handleClose}
                        className="text-body-large text-text-primary py-2"
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

type LinkItem = NonNullable<NonNullable<LinkGroupProps["links"]>["mainLinks"]>[number];

function getLinkHref(link: LinkItem): string | null {
  if (link.linkType === "internal" && link._type) {
    return resolvePath(link._type, link.slug ? { slug: link.slug } : {});
  }
  if (link.linkType === "external" && "url" in link) {
    return link.url;
  }
  return null;
}

function getMenuItemHref(item: NonNullable<MainMenuProps>[number]): string | null {
  if (item.linkType === "internal" && item._type) {
    return resolvePath(item._type, item.slug ? { slug: item.slug } : {});
  }
  if (item.linkType === "external" && "url" in item) {
    return item.url;
  }
  return null;
}
