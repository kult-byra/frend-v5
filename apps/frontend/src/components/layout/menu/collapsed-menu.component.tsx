"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon.component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn.util";
import { ContactWidgetContent } from "./contact-widget-content.component";
import { getLinkHref } from "./link-href.util";
import type { LinkGroupProps, MainMenuProps, SecondaryMenuProps } from "./menu.types";
import { NavBadge } from "./nav-badge.component";

type CollapsedMenuProps = {
  mainMenu: MainMenuProps;
  secondaryMenu: SecondaryMenuProps;
  newsEventsCount: number;
  headerInverted?: boolean;
};

export const CollapsedMenu = (props: CollapsedMenuProps) => {
  const { mainMenu, secondaryMenu, newsEventsCount, headerInverted } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showContactWidget, setShowContactWidget] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  // Find the active link group
  const activeLinkGroup = mainMenu?.find(
    (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activeCategory,
  );

  // Find the contact link group (can be in mainMenu or secondaryMenu)
  const contactLinkGroup = useMemo(
    () =>
      mainMenu?.find(
        (item): item is LinkGroupProps =>
          item.linkType === "linkGroup" && item.menuType === "contact",
      ) ??
      secondaryMenu?.find(
        (item): item is LinkGroupProps =>
          item.linkType === "linkGroup" && item.menuType === "contact",
      ),
    [mainMenu, secondaryMenu],
  );

  // Filter out contact-type linkGroups from the regular menu
  const regularLinkGroups = useMemo(
    () =>
      mainMenu?.filter((item) => !(item.linkType === "linkGroup" && item.menuType === "contact")),
    [mainMenu],
  );

  // Set first non-contact linkGroup as default when opening
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setShowContactWidget(false);
    const firstLinkGroup = regularLinkGroups?.find((item) => item.linkType === "linkGroup");
    if (firstLinkGroup) {
      setActiveCategory(firstLinkGroup._key);
    }
  }, [regularLinkGroups]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveCategory(null);
    setShowContactWidget(false);
    // Return focus to the menu trigger button
    menuTriggerRef.current?.focus();
  }, []);

  const handleContactClick = () => {
    setShowContactWidget(true);
    setActiveCategory(null);
  };

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus the close button when menu opens
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const mainLinks = activeLinkGroup?.links?.mainLinks ?? [];
  const linkGroupSecondaryLinks = activeLinkGroup?.links?.secondaryLinks ?? [];

  return (
    <div className="laptop:hidden">
      {/* Menu trigger button */}
      <button
        ref={menuTriggerRef}
        type="button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Åpne meny"
        className={cn(
          "backdrop-blur-[5px] rounded px-2xs py-3xs text-body",
          headerInverted
            ? "bg-white/15 text-text-white-primary"
            : "bg-container-shade text-text-primary",
        )}
      >
        Meny
      </button>

      {/* Fullscreen overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigasjonsmeny"
        inert={!isOpen ? true : undefined}
        className={cn(
          "fixed inset-0 z-50 flex min-h-dvh flex-col transition-opacity duration-200",
          showContactWidget ? "bg-container-overlay-primary-2" : "bg-light-purple",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-xs py-2xs h-[52px]">
          <Link href="/" onClick={handleClose} className="font-semibold text-lg">
            frend
          </Link>
          <div className="flex items-center gap-xs">
            {/* Contact badge - only show if contact linkGroup exists */}
            {contactLinkGroup && (
              <button
                type="button"
                onClick={handleContactClick}
                aria-pressed={showContactWidget}
                className={cn(
                  "rounded px-2xs py-3xs text-body text-text-primary",
                  showContactWidget
                    ? "bg-container-brand-1 text-text-white-primary"
                    : "bg-container-shade backdrop-blur-[5px]",
                )}
              >
                {contactLinkGroup.title}
              </button>
            )}
            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Lukk meny"
              className="size-8 flex items-center justify-center"
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>
        </div>

        {/* Category badges row - only show when not in contact view */}
        {!showContactWidget && (
          <nav
            aria-label="Kategorier"
            className="flex items-center gap-2xs px-xs py-2xs border-y border-stroke-soft overflow-x-auto"
          >
            {regularLinkGroups?.map((item) => {
              if (item.linkType !== "linkGroup") return null;
              return (
                <NavBadge
                  key={item._key}
                  item={item}
                  isActive={activeCategory === item._key}
                  onClick={() => {
                    setActiveCategory(item._key);
                    setShowContactWidget(false);
                  }}
                  notificationCount={
                    item.menuType === "newsAndEvents" ? newsEventsCount : undefined
                  }
                />
              );
            })}
          </nav>
        )}

        {/* Regular menu content */}
        {!showContactWidget && (
          <ScrollArea className="flex-1">
            <nav aria-label="Hovednavigasjon" className="flex flex-col gap-md px-xs pb-xs pt-sm">
              {/* Main links - large headings */}
              {mainLinks.length > 0 && (
                <ul className="flex flex-col gap-sm">
                  {mainLinks.map((link) => {
                    const href = getLinkHref(link);
                    if (!href) return null;
                    return (
                      <li key={link._key}>
                        <Link
                          href={href}
                          onClick={handleClose}
                          className="text-headline-2 text-text-primary"
                        >
                          {link.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Link group secondary links */}
              {linkGroupSecondaryLinks.length > 0 && (
                <ul className="flex flex-col gap-sm">
                  {linkGroupSecondaryLinks.map((link) => {
                    const href = getLinkHref(link);
                    if (!href) return null;
                    return (
                      <li key={link._key}>
                        <Link
                          href={href}
                          onClick={handleClose}
                          className="text-body-large text-text-primary"
                        >
                          {link.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Secondary menu items (About us, Careers, etc.) */}
              {secondaryMenu && secondaryMenu.length > 0 && (
                <ul className="flex flex-col gap-sm border-t border-stroke-soft pt-sm">
                  {secondaryMenu.map((item) => {
                    const href = getLinkHref(item);
                    if (!href) return null;
                    return (
                      <li key={item._key}>
                        <Link
                          href={href}
                          onClick={handleClose}
                          className="text-body-large text-text-primary"
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </nav>
          </ScrollArea>
        )}

        {/* Contact widget content */}
        {showContactWidget && contactLinkGroup && (
          <ScrollArea className="flex-1">
            <div className="px-xs py-sm">
              <ContactWidgetContent
                linkGroup={contactLinkGroup}
                onLinkClick={handleClose}
                variant="mobile"
              />
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
