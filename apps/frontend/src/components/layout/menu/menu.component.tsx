"use client";

import { useState } from "react";
import { CollapsedMenu } from "@/components/layout/menu/collapsed-menu.component";
import { ExpandedMenu } from "@/components/layout/menu/expanded-menu.component";
import { NavPanel } from "@/components/layout/menu/nav-panel.component";
import type { MenuSettingsQueryResult } from "@/sanity-types";
import type { LinkGroupProps } from "./menu.types";

type MenuProps = NonNullable<MenuSettingsQueryResult> & {
  newsEventsCount: number;
};

export const Menu = (props: MenuProps) => {
  const { mainMenu, secondaryMenu, newsEventsCount } = props;
  const [activePanel, setActivePanel] = useState<string | null>(null);

  if (!mainMenu) return null;

  const activeLinkGroup = mainMenu?.find(
    (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activePanel,
  );

  return (
    <>
      <nav aria-label="Hovedmeny" data-primary-nav="true" className="flex items-center">
        <ExpandedMenu
          mainMenu={mainMenu}
          secondaryMenu={secondaryMenu}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          newsEventsCount={newsEventsCount}
        />
        <CollapsedMenu
          mainMenu={mainMenu}
          secondaryMenu={secondaryMenu}
          newsEventsCount={newsEventsCount}
        />
      </nav>

      <NavPanel
        isOpen={activePanel !== null}
        onClose={() => setActivePanel(null)}
        linkGroup={activeLinkGroup}
        mainMenu={mainMenu}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        newsEventsCount={newsEventsCount}
      />
    </>
  );
};
