"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
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

  const [activePanel, setActivePanel] = useState<string | null>(null);

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  // Determine if active panel is contact widget
  const activeLinkGroup =
    mainMenu?.find(
      (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activePanel,
    ) ??
    secondaryMenu?.find(
      (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activePanel,
    );

  const isContactWidget = activeLinkGroup?.menuType === "contact";

  // Close panel on escape key or click outside (click outside disabled for contact widget)
  useEffect(() => {
    if (!activePanel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Don't close panel if event originates from within a Radix Select dropdown
        const target = e.target as Element;
        const isInSelect =
          target.closest?.("[data-radix-select-content]") ||
          target.closest?.("[data-radix-select-viewport]") ||
          target.closest?.("[role='listbox']");
        if (isInSelect) return;

        // Also check if any select trigger is in open state
        const openSelectTrigger = document.querySelector(
          "[data-radix-select-trigger][data-state='open']",
        );
        if (openSelectTrigger) return;

        closePanel();
      }
    };

    // Use capture phase to check for open selects before Radix closes them
    document.addEventListener("keydown", handleKeyDown, true);

    // Skip click-outside logic for contact widget (close via button only)
    if (isContactWidget) {
      return () => {
        document.removeEventListener("keydown", handleKeyDown, true);
      };
    }

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element;

      // Check if click is inside menu panels, nav area, or Radix UI portals
      const isInsideMenu =
        target.closest?.("[data-menu-panel]") ||
        navAreaRef.current?.contains(target) ||
        target.closest?.("[data-radix-popper-content-wrapper]");

      if (!isInsideMenu) {
        closePanel();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [activePanel, closePanel, navAreaRef, isContactWidget]);

  if (!mainMenu) return null;

  return (
    <>
      <nav
        aria-label="Hovedmeny"
        data-primary-nav="true"
        className="relative z-40 flex items-center"
      >
        <ExpandedMenu
          mainMenu={mainMenu}
          secondaryMenu={secondaryMenu}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
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
        isOpen={activePanel !== null && !isContactWidget}
        onClose={closePanel}
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
