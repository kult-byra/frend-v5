"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { Banner } from "@/components/layout/banner.component";
import { Menu } from "@/components/layout/menu/menu.component";
import { Logo } from "@/components/logo.component";
import { env } from "@/env";
import { useResizeObserver } from "@/hooks/use-resize-observer.hook";
import type { SettingsQueryResult } from "@/sanity-types";

export const Header = (props: SettingsQueryResult) => {
  const { siteSettings, menuSettings, newsEventsCount } = props;
  const navAreaRef = useRef<HTMLDivElement>(null);

  // Update CSS variable for nav panel width when nav area size changes
  const updateNavWidth = useCallback((entry: ResizeObserverEntry) => {
    const width = entry.contentRect.width;
    // Add padding (px-xs = 16px on each side)
    document.documentElement.style.setProperty("--nav-panel-width", `${width + 32}px`);
  }, []);

  useResizeObserver(navAreaRef, updateNavWidth);

  return (
    <header className="fixed top-0 right-0 left-0 z-40">
      {siteSettings && <Banner {...siteSettings} />}

      <div className="flex items-center justify-between px-xs py-2xs">
        {/* Primary nav area (logo + main menu) - this determines panel width */}
        <div ref={navAreaRef} className="relative z-40 flex items-center gap-sm">
          <Link
            href="/"
            className="relative z-40 shrink-0"
            aria-label={`Til forsiden - ${env.NEXT_PUBLIC_SITE_TITLE}`}
          >
            <Logo color="dark" width={80} height={27} priority />
          </Link>

          {menuSettings && (
            <Menu
              {...menuSettings}
              newsEventsCount={newsEventsCount ?? 0}
              navAreaRef={navAreaRef}
            />
          )}
        </div>
      </div>
    </header>
  );
};
