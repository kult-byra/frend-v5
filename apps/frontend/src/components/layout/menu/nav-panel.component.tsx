"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { resolvePath } from "@workspace/routing/src/resolve-path";
import { cn } from "@/utils/cn.util";
import { NavBadge } from "./nav-badge.component";
import type { LinkGroupProps, MainMenuProps } from "./menu.types";

type NavPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  linkGroup: LinkGroupProps | undefined;
  mainMenu: MainMenuProps;
  activePanel: string | null;
  setActivePanel: Dispatch<SetStateAction<string | null>>;
  newsEventsCount: number;
};

export const NavPanel = (props: NavPanelProps) => {
  const { isOpen, onClose, linkGroup, mainMenu, activePanel, setActivePanel, newsEventsCount } = props;

  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const mainLinks = linkGroup?.links?.mainLinks ?? [];
  const secondaryLinks = linkGroup?.links?.secondaryLinks ?? [];

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed top-0 left-0 h-full z-30 bg-light-purple transition-transform duration-200 ease-out hidden menu:block",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={linkGroup ? `${linkGroup.title} navigation` : "Navigation panel"}
    >
      {/* Header with category badges - matches header layout */}
      <div className="flex items-center h-[52px] px-4 py-2 gap-6">
        {/* Invisible logo spacer to align badges with header */}
        <span className="font-semibold text-lg opacity-0 select-none" aria-hidden="true">frend</span>
        <div className="flex items-center gap-2">
          {mainMenu?.map((item) => {
            if (item.linkType !== "linkGroup") return null;
            return (
              <NavBadge
                key={item._key}
                item={item}
                isActive={activePanel === item._key}
                onClick={() => setActivePanel(activePanel === item._key ? null : item._key)}
                notificationCount={
                  item.menuType === "newsAndEvents" ? newsEventsCount : undefined
                }
              />
            );
          })}
        </div>
      </div>

      {/* Panel content */}
      <div className="flex flex-col gap-14 px-4 pb-4 pt-6">
        {/* Main links - large headings */}
        {mainLinks.length > 0 && (
          <div className="flex flex-col gap-6">
            {mainLinks.map((link) => (
              <PanelMainLink key={link._key} link={link} onClose={onClose} />
            ))}
          </div>
        )}

        {/* Secondary links - smaller text */}
        {secondaryLinks.length > 0 && (
          <div className="flex flex-col gap-6">
            {secondaryLinks.map((link) => (
              <PanelSecondaryLink key={link._key} link={link} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

type MainLinksArray = NonNullable<NonNullable<LinkGroupProps["links"]>["mainLinks"]>;
type PanelLinkProps = {
  link: MainLinksArray[number];
  onClose: () => void;
};

const PanelMainLink = ({ link, onClose }: PanelLinkProps) => {
  const href = getHref(link);
  if (!href) return null;

  return (
    <Link
      href={href}
      onClick={onClose}
      className="text-headline-2 text-text-primary hover:opacity-70 transition-opacity"
    >
      {link.title}
    </Link>
  );
};

const PanelSecondaryLink = ({ link, onClose }: PanelLinkProps) => {
  const href = getHref(link);
  if (!href) return null;

  return (
    <Link
      href={href}
      onClick={onClose}
      className="text-body-large text-text-primary hover:opacity-70 transition-opacity"
    >
      {link.title}
    </Link>
  );
};

function getHref(link: PanelLinkProps["link"]): string | null {
  if (link.linkType === "internal" && link._type) {
    return resolvePath(link._type, link.slug ? { slug: link.slug } : {});
  }
  if (link.linkType === "external" && "url" in link) {
    return link.url;
  }
  return null;
}
