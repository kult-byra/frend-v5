import { Container } from "@/components/layout/container.component";
import { H2 } from "@/components/layout/heading.component";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import { env } from "@/env";
import type { SettingsQueryResult } from "@/sanity-types";

export const Footer = (props: SettingsQueryResult) => {
  const { siteSettings } = props;

  const { privacyPolicyPage } = siteSettings ?? {};

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100">
      <Container className="py-9">
        <H2>{env.NEXT_PUBLIC_SITE_TITLE}</H2>
      </Container>

      <Container>
        <div className="flex flex-col gap-y-1 border-t border-slate-200 py-6 text-xs md:text-2xs sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="flex items-center gap-1">
            <span>
              {env.NEXT_PUBLIC_SITE_TITLE} {currentYear}
            </span>

            <span aria-hidden="true">©</span>

            {privacyPolicyPage?.title && (
              <span>
                <LinkResolver
                  linkType="internal"
                  slug={privacyPolicyPage.slug}
                  _type="page"
                  className="border-b border-slate-400 transition-colors hover:border-slate-800"
                >
                  {privacyPolicyPage.title}
                </LinkResolver>
              </span>
            )}
          </p>

          <p>
            Laget av{" "}
            <LinkResolver
              linkType="external"
              url="https://kult.design"
              className="border-b border-slate-400 transition-colors hover:border-slate-800"
              aria-label="Kult Byrå"
            >
              Kult Byrå
            </LinkResolver>
          </p>
        </div>
      </Container>
    </footer>
  );
};
