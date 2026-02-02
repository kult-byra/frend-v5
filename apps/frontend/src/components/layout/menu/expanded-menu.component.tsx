"use client";

import type { Dispatch, SetStateAction } from "react";
import { NavBadge } from "@/components/layout/menu/nav-badge.component";
import type { MainMenuProps, SecondaryMenuProps } from "./menu.types";

type ExpandedMenuProps = {
  mainMenu: MainMenuProps;
  secondaryMenu: SecondaryMenuProps;
  activePanel: string | null;
  setActivePanel: Dispatch<SetStateAction<string | null>>;
  newsEventsCount: number;
  headerInverted?: boolean;
};

export const ExpandedMenu = (props: ExpandedMenuProps) => {
  const { mainMenu, secondaryMenu, activePanel, setActivePanel, newsEventsCount, headerInverted } =
    props;

  return (
    <>
      {/* Main menu badges - inside panel area */}
      <div className="hidden laptop:flex items-center gap-2xs shrink-0">
        {mainMenu?.map((item) => (
          <NavBadge
            key={item._key}
            item={item}
            isActive={activePanel === item._key}
            inverted={headerInverted}
            onClick={() => {
              if (item.linkType === "linkGroup") {
                // Toggle panel: close if same, open if different
                setActivePanel(activePanel === item._key ? null : item._key);
              }
            }}
            notificationCount={
              item.linkType === "linkGroup" && item.menuType === "newsAndEvents"
                ? newsEventsCount
                : undefined
            }
          />
        ))}
      </div>

      {/* Secondary menu badges - right aligned, outside panel area */}
      {secondaryMenu && secondaryMenu.length > 0 && (
        <div className="hidden laptop:flex items-center gap-xs fixed right-xs top-2xs z-40">
          {secondaryMenu.map((item) => (
            <NavBadge
              key={item._key}
              item={item}
              isActive={activePanel === item._key}
              inverted={headerInverted}
              onClick={() => {
                if (item.linkType === "linkGroup") {
                  // Toggle panel: close if same, open if different
                  setActivePanel(activePanel === item._key ? null : item._key);
                }
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};
