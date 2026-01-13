import Link from "next/link";

import { Banner } from "@/components/layout/banner.component";
import { Container } from "@/components/layout/container.component";
import { Menu } from "@/components/layout/menu/menu.component";
import { env } from "@/env";

import type { SettingsQueryResult } from "@/sanity-types";

export const Header = (props: SettingsQueryResult) => {
  const { siteSettings, menuSettings } = props;

  return (
    <header className="top-header">
      {siteSettings && <Banner {...siteSettings} />}

      <Container className="flex items-center justify-between py-5 md:py-7">
        <Link
          href="/"
          className="font-semibold text-lg relative z-50"
          aria-label={`Til forsiden - ${env.NEXT_PUBLIC_SITE_TITLE}`}
        >
          {env.NEXT_PUBLIC_SITE_TITLE}
        </Link>

        {menuSettings && <Menu {...menuSettings} />}
      </Container>
    </header>
  );
};
