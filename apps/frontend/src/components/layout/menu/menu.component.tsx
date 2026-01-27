"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CollapsedMenu } from "@/components/layout/menu/collapsed-menu.component";
import { ContactWidget } from "@/components/layout/menu/contact-widget.component";
import { ExpandedMenu } from "@/components/layout/menu/expanded-menu.component";
import { NavPanel } from "@/components/layout/menu/nav-panel.component";
import type { MenuSettingsQueryResult } from "@/sanity-types";
import type { LinkGroupProps } from "./menu.types";

type MenuProps = NonNullable<MenuSettingsQueryResult> & {
  newsEventsCount: number;
  navAreaRef: RefObject<HTMLDivElement | null>;
  headerInverted?: boolean;
};

export const Menu = (props: MenuProps) => {
  const { mainMenu, secondaryMenu, newsEventsCount, navAreaRef, headerInverted } = props;

  // Consolidated menu state
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  // Close panel helper
  const closePanel = useCallback(() => {
    setActivePanel(null);
    setIsPinned(false);
  }, []);

  // Handle escape key - shared across all panels
  useEffect(() => {
    if (!activePanel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activePanel, closePanel]);

  // Close pinned panel when clicking outside
  useEffect(() => {
    if (!isPinned || !activePanel) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsidePanel = panelRef.current?.contains(target);
      const isInsideNavArea = navAreaRef.current?.contains(target);

      if (!isInsidePanel && !isInsideNavArea) {
        closePanel();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isPinned, activePanel, closePanel, navAreaRef]);

  // Close panel when mouse leaves the combined nav area (logo + badges + panel)
  // Only close if not pinned (pinned = opened via click)
  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (isPinned) return;

      const relatedTarget = e.relatedTarget as Node | null;

      // Check if mouse moved to the panel or header nav area (includes logo)
      const isMovingToPanel = panelRef.current?.contains(relatedTarget);
      const isMovingToNavArea = navAreaRef.current?.contains(relatedTarget);

      if (!isMovingToPanel && !isMovingToNavArea) {
        setActivePanel(null);
      }
    },
    [isPinned, navAreaRef],
  );

  if (!mainMenu) return null;

  // Find active linkGroup in both mainMenu and secondaryMenu
  const activeLinkGroup =
    mainMenu.find(
      (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activePanel,
    ) ??
    secondaryMenu?.find(
      (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activePanel,
    );

  const isContactWidget = activeLinkGroup?.menuType === "contact";

  return (
    <>
      <nav
        aria-label="Hovedmeny"
        data-primary-nav="true"
        className="relative z-40 flex items-center"
        onMouseLeave={handleMouseLeave}
      >
        <ExpandedMenu
          mainMenu={mainMenu}
          secondaryMenu={secondaryMenu}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
          newsEventsCount={newsEventsCount}
          headerInverted={headerInverted}
        />
        <CollapsedMenu
          mainMenu={mainMenu}
          secondaryMenu={secondaryMenu}
          newsEventsCount={newsEventsCount}
          headerInverted={headerInverted}
        />
      </nav>

      {/* Regular nav panel for non-contact link groups */}
      <NavPanel
        ref={panelRef}
        isOpen={activePanel !== null && !isContactWidget}
        onClose={closePanel}
        onMouseLeave={handleMouseLeave}
        linkGroup={activeLinkGroup}
      />

      {/* Contact widget for contact menu type */}
      <ContactWidget
        isOpen={activePanel !== null && isContactWidget}
        onClose={closePanel}
        linkGroup={activeLinkGroup}
      />
    </>
  );
};
