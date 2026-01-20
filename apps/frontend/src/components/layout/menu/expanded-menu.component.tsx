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
};

export const ExpandedMenu = (props: ExpandedMenuProps) => {
  const { mainMenu, secondaryMenu, activePanel, setActivePanel, newsEventsCount } = props;

  return (
    <div className="hidden laptop:flex items-center">
      {/* Main menu badges */}
      <div className="flex items-center gap-2 shrink-0">
        {mainMenu?.map((item) => (
          <NavBadge
            key={item._key}
            item={item}
            isActive={activePanel === item._key}
            onClick={() => {
              if (item.linkType === "linkGroup") {
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

      {/* Secondary menu badges */}
      {secondaryMenu && secondaryMenu.length > 0 && (
        <div className="flex items-center gap-4 absolute right-4">
          {secondaryMenu.map((item) => (
            <NavBadge key={item._key} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
