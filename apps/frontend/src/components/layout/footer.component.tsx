import { SanityImage } from "sanity-image";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { Container } from "@/components/layout/container.component";
import { Logo } from "@/components/logo.component";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import { env } from "@/env";
import type { SettingsQueryResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";

type FooterProps = Pick<
  SettingsQueryResult,
  "siteSettings" | "footerSettings" | "organisationSettings"
>;

export const Footer = (props: FooterProps) => {
  const { siteSettings, footerSettings, organisationSettings } = props;

  const { privacyPolicyPage } = siteSettings ?? {};

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-container-brand-1 text-text-white-primary">
      {/* Main footer content */}
      <Container className="py-4">
        {/* Links section */}
        <div className="flex flex-col gap-4 border-t border-stroke-soft-inverted pt-4 md:flex-row md:gap-4">
          {/* Contact column */}
          <FooterContactSection organisationSettings={organisationSettings} />

          {/* Links column */}
          <FooterLinksSection footerSettings={footerSettings} />

          {/* Certifications column */}
          <FooterCertificationsSection organisationSettings={organisationSettings} />
        </div>
      </Container>

      {/* Legal section */}
      <Container className="relative flex min-h-[423px] flex-col justify-end pb-0">
        <div className="flex items-end justify-between">
          {/* Legal text */}
          <div className="flex flex-col gap-1 p-4 text-body-small">
            <p>
              Copyright &copy; {currentYear} {env.NEXT_PUBLIC_SITE_TITLE}
            </p>
            {privacyPolicyPage?.title && (
              <LinkResolver
                linkType="internal"
                slug={privacyPolicyPage.slug}
                _type="page"
                className="underline transition-colors hover:text-orange"
              >
                {privacyPolicyPage.title}
              </LinkResolver>
            )}
          </div>

          {/* Illustration - bottom center */}
          {footerSettings?.illustration && (
            <div className="pointer-events-none absolute bottom-0 left-1/2 hidden -translate-x-1/2 select-none md:block">
              <Illustration
                name={footerSettings.illustration as IllustrationName}
                className="h-auto w-[320px] lg:w-[423px]"
              />
            </div>
          )}

          {/* Logo - bottom right */}
          <div className="hidden p-4 md:block">
            <Logo color="orange" variant="angled2" width={423} height={466} />
          </div>
        </div>
      </Container>
    </footer>
  );
};

const FooterContactSection = ({
  organisationSettings,
}: Pick<FooterProps, "organisationSettings">) => {
  const { address, phoneNumber, email, socialMediaLinks } = organisationSettings ?? {};

  return (
    <div className="flex flex-1 flex-col gap-10">
      <p className="text-body-small text-text-white-secondary">Contact</p>

      <div className="flex flex-col gap-6">
        {/* Address */}
        {address && (
          <address className="text-body not-italic">
            {address.street}
            <br />
            {address.zipCode} {address.city}
          </address>
        )}

        {/* Email and phone */}
        <div className="flex flex-col gap-2">
          {email && <UnderlineLink href={`mailto:${email}`}>{email}</UnderlineLink>}
          {phoneNumber && <UnderlineLink href={`tel:${phoneNumber}`}>{phoneNumber}</UnderlineLink>}
        </div>

        {/* Social media */}
        {socialMediaLinks && socialMediaLinks.length > 0 && (
          <div className="flex flex-col gap-2">
            {socialMediaLinks.map((link) => (
              <ExternalLinkWithArrow key={link._key} href={link.url} title={link.title} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FooterLinksSection = ({ footerSettings }: Pick<FooterProps, "footerSettings">) => {
  const { footerLinks } = footerSettings ?? {};

  if (!footerLinks || footerLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-10">
      <p className="text-body-small text-text-white-secondary">Links</p>

      <div className="flex flex-col gap-2">
        {footerLinks.map((link) => {
          if (link.linkType === "internal" && link.slug) {
            return (
              <LinkResolver
                key={link._key}
                linkType="internal"
                slug={link.slug}
                _type={link._type}
                className="w-fit border-b border-stroke-soft-inverted text-body transition-colors hover:border-white"
              >
                {link.title}
              </LinkResolver>
            );
          }

          if (link.linkType === "external") {
            return <ExternalLinkWithArrow key={link._key} href={link.url} title={link.title} />;
          }

          return null;
        })}
      </div>
    </div>
  );
};

const FooterCertificationsSection = ({
  organisationSettings,
}: Pick<FooterProps, "organisationSettings">) => {
  const { certifications } = organisationSettings ?? {};

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-10">
      <p className="text-body-small text-text-white-secondary">Certifications</p>

      <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
        {certifications.map((cert) => (
          <div key={cert._key} className="flex items-center gap-2">
            {cert.logo?.image?.asset && (
              <SanityImage
                id={cert.logo.image.asset._id}
                projectId={env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                dataset={env.NEXT_PUBLIC_SANITY_DATASET}
                alt={cert.logo.title ?? ""}
                width={64}
                height={64}
                className="h-6 w-auto brightness-0 invert"
              />
            )}
            <span className="text-body-small">{cert.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const UnderlineLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <a
    href={href}
    className={cn(
      "w-fit border-b border-stroke-soft-inverted text-body transition-colors hover:border-white",
      className,
    )}
  >
    {children}
  </a>
);

const ExternalLinkWithArrow = ({ href, title }: { href: string; title: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex w-fit items-center gap-1 border-b border-stroke-soft-inverted text-body transition-colors hover:border-white"
  >
    {title}
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="mt-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      aria-hidden="true"
    >
      <path
        d="M1 9L9 1M9 1H2M9 1V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </a>
);
