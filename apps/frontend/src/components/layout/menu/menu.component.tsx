"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import { CollapsedMenu } from "@/components/layout/menu/collapsed-menu.component";
import { ContactWidget } from "@/components/layout/menu/contact-widget.component";
import { ExpandedMenu } from "@/components/layout/menu/expanded-menu.component";
import { NavPanel } from "@/components/layout/menu/nav-panel.component";
import type { MenuSettingsQueryResult } from "@/sanity-types";
import type { LinkGroupProps } from "./menu.types";

type MenuProps = NonNullable<MenuSettingsQueryResult> & {
  newsEventsCount: number;
  activePanel: string | null;
  setActivePanel: Dispatch<SetStateAction<string | null>>;
  isPinned: boolean;
  setIsPinned: Dispatch<SetStateAction<boolean>>;
  headerNavAreaRef: RefObject<HTMLDivElement | null>;
};

export const Menu = (props: MenuProps) => {
  const {
    mainMenu,
    secondaryMenu,
    newsEventsCount,
    activePanel,
    setActivePanel,
    isPinned,
    setIsPinned,
    headerNavAreaRef,
  } = props;
  const panelRef = useRef<HTMLElement>(null);

  // Close pinned panel when clicking outside
  useEffect(() => {
    if (!isPinned || !activePanel) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsidePanel = panelRef.current?.contains(target);
      const isInsideNavArea = headerNavAreaRef.current?.contains(target);

      if (!isInsidePanel && !isInsideNavArea) {
        setActivePanel(null);
        setIsPinned(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isPinned, activePanel, setActivePanel, setIsPinned, headerNavAreaRef]);

  if (!mainMenu) return null;

  // Look for active linkGroup in both mainMenu and secondaryMenu
  const activeLinkGroup =
    mainMenu?.find(
      (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activePanel,
    ) ??
    secondaryMenu?.find(
      (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activePanel,
    );

  const isContactWidget = activeLinkGroup?.menuType === "contact";

  // Close panel when mouse leaves the combined nav area (logo + badges + panel)
  // Only close if not pinned (pinned = opened via click)
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isPinned) return;

    const relatedTarget = e.relatedTarget as Node | null;

    // Check if mouse moved to the panel or header nav area (includes logo)
    const isMovingToPanel = panelRef.current?.contains(relatedTarget);
    const isMovingToNavArea = headerNavAreaRef.current?.contains(relatedTarget);

    if (!isMovingToPanel && !isMovingToNavArea) {
      setActivePanel(null);
    }
  };

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
        />
        <CollapsedMenu
          mainMenu={mainMenu}
          secondaryMenu={secondaryMenu}
          newsEventsCount={newsEventsCount}
        />
      </nav>

      {/* Regular nav panel for non-contact link groups */}
      <NavPanel
        ref={panelRef}
        isOpen={activePanel !== null && !isContactWidget}
        onClose={() => {
          setActivePanel(null);
          setIsPinned(false);
        }}
        onMouseLeave={handleMouseLeave}
        linkGroup={activeLinkGroup}
      />

      {/* Contact widget for contact menu type */}
      <ContactWidget
        isOpen={activePanel !== null && isContactWidget}
        onClose={() => {
          setActivePanel(null);
          setIsPinned(false);
        }}
        linkGroup={activeLinkGroup}
      />
    </>
  );
};
