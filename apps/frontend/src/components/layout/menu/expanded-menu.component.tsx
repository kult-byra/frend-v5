"use client";

import { MenuItem } from "@/components/layout/menu/menu-item.component";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import type { MainMenuProps } from "./menu.types";

export const ExpandedMenu = (props: { mainMenu: MainMenuProps }) => {
  const { mainMenu } = props;

  return (
    <NavigationMenu className="hidden menu:flex text-sm">
      <NavigationMenuList>
        {mainMenu?.map((item) => (
          <MenuItem key={item._key} {...item} />
        ))}
      </NavigationMenuList>

      <NavigationMenuViewport />
    </NavigationMenu>
  );
};
