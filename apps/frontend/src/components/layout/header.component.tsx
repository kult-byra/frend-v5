import Link from "next/link";

import { Banner } from "@/components/layout/banner.component";
import { Menu } from "@/components/layout/menu/menu.component";
import { Logo } from "@/components/logo.component";
import { env } from "@/env";

import type { SettingsQueryResult } from "@/sanity-types";

export const Header = (props: SettingsQueryResult) => {
  const { siteSettings, menuSettings, newsEventsCount } = props;

  return (
    <header className="top-header">
      {siteSettings && <Banner {...siteSettings} />}

      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="relative z-50 shrink-0"
            aria-label={`Til forsiden - ${env.NEXT_PUBLIC_SITE_TITLE}`}
          >
            <Logo color="dark" width={80} height={27} priority />
          </Link>

          {menuSettings && <Menu {...menuSettings} newsEventsCount={newsEventsCount ?? 0} />}
        </div>
      </div>
    </header>
  );
};
