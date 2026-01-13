"use client";

import { Container } from "@/components/layout/container.component";
import { MenuItem } from "@/components/layout/menu/menu-item.component";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/cn.util";
import { useSelectorDimensions } from "@/utils/hooks/use-selector-dimensions.hook";
import type { MainMenuProps } from "./menu.types";

export const CollapsedMenu = (props: { mainMenu: MainMenuProps }) => {
  const { mainMenu } = props;

  const { dimensions: headerDimensions } = useSelectorDimensions(".top-header");

  return (
    <Sheet>
      <SheetTitle className="hidden">Meny</SheetTitle>
      <SheetTrigger aria-label="Åpne eller lukk meny" className="menu:hidden relative z-50 group">
        <AnimatedHamburger />
      </SheetTrigger>

      <SheetContent
        side="top"
        className="menu:hidden !pointer-events-none"
        overlayClassName="menu:hidden"
        style={{ paddingTop: headerDimensions?.height }}
        id="mobile-navigation-menu"
      >
        <ScrollArea className="pointer-events-auto">
          <Container paddingY>
            <NavigationMenu orientation="vertical">
              <NavigationMenuList>
                {mainMenu?.map((item) => (
                  <MenuItem key={item._key} {...item} />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </Container>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export const AnimatedHamburger = () => {
  const hamburgerLines = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="relative z-[2] flex items-center gap-[0.5em]">
      <span className="uppercase font-medium text-xs">
        <span className="group-[[data-state='open']]:hidden">Meny</span>
        <span className="group-[[data-state='closed']]:hidden">Lukk</span>
      </span>

      <span className="relative block h-[0.8em] w-[1.1em] text-dark">
        {hamburgerLines.map((index) => (
          <span
            key={index}
            className={cn(
              getLineStyle(index),
              "absolute block h-[2px] w-full bg-current transition",
            )}
          />
        ))}
      </span>
    </div>
  );
};

const getLineStyle = (index: number) => {
  switch (index) {
    case 0:
      return "top-0 group-[[data-state='open']]:opacity-0";
    case 1:
      return "top-1/2 -translate-y-1/2 group-[[data-state='open']]:rotate-45";
    case 2:
      return "top-1/2 -translate-y-1/2 opacity-0 group-[[data-state='open']]:-rotate-45 group-[[data-state='open']]:opacity-100";
    case 3:
      return "bottom-0 group-[[data-state='open']]:opacity-0";
  }
};
