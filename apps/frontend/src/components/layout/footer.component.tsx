import Image from "next/image";
import { NewsletterForm } from "@/components/hubspot/newsletter-form.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { Container } from "@/components/layout/container.component";
import { LanguageSwitcher } from "@/components/layout/language-switcher.component";
import { Logo } from "@/components/logo.component";
import { PageBuilder } from "@/components/page-builder/page-builder.component";
import type { PageBuilderType } from "@/components/page-builder/page-builder.types";
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
  const preFooter = footerSettings?.preFooter as PageBuilderType | undefined;

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Pre-footer content */}
      {preFooter && preFooter.length > 0 && <PageBuilder pageBuilder={preFooter} />}

      <footer className="bg-container-brand-1 text-text-white-primary">
        {/* Language & Newsletter section */}
        <Container className="flex flex-col gap-md pb-xl pt-xs lg:flex-row lg:items-start lg:justify-between lg:gap-xs">
          <LanguageSwitcher variant="footer" />
          <FooterNewsletterSection
            newsletterText={footerSettings?.newsletterText}
            newsletterForm={footerSettings?.newsletterForm}
          />
        </Container>

        {/* Main footer content */}
        <Container className="p-xs">
          {/* Links section */}
          <div className="flex flex-col gap-md border-t border-stroke-soft-inverted pt-xs">
            {/* Contact & Links columns - 2 columns on mobile, 3 on desktop */}
            <div className="flex gap-xs lg:gap-xs">
              {/* Contact column */}
              <FooterContactSection organisationSettings={organisationSettings} />

              {/* Links column */}
              <FooterLinksSection footerSettings={footerSettings} />

              {/* Certifications column - desktop only */}
              <div className="hidden flex-1 lg:block">
                <FooterCertificationsSection
                  organisationSettings={organisationSettings}
                  layout="horizontal"
                />
              </div>
            </div>

            {/* Certifications - mobile only (full width below columns) */}
            <div className="lg:hidden">
              <FooterCertificationsSection
                organisationSettings={organisationSettings}
                layout="vertical"
              />
            </div>
          </div>
        </Container>

        {/* Legal section */}
        {/* Mobile illustration - full width, no padding, left aligned */}
        {footerSettings?.illustration && (
          <div className="pointer-events-none select-none lg:hidden">
            <Illustration
              name={
                ((footerSettings as { mobileIllustration?: string }).mobileIllustration ??
                  footerSettings.illustration) as IllustrationName
              }
              className="h-auto w-full"
            />
          </div>
        )}

        {/* Legal bar - flex row with copyright | illustration | logo */}
        <Container className="overflow-hidden pb-0">
          <div className="flex items-end justify-between">
            {/* Legal text */}
            <div className="flex flex-col gap-3xs py-xs text-body-small">
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

            {/* Desktop illustration - centered in row, hidden on mobile */}
            {footerSettings?.illustration && (
              <div className="pointer-events-none hidden shrink-0 select-none lg:block">
                <Illustration
                  name={footerSettings.illustration as IllustrationName}
                  className="h-auto w-[320px] lg:w-[423px]"
                />
              </div>
            )}

            {/* Logo - small on mobile, large on desktop */}
            <div className="py-xs">
              {/* Mobile logo */}
              <div className="lg:hidden">
                <Logo color="orange" variant="angled2" width={118} height={157} />
              </div>
              {/* Desktop logo */}
              <div className="hidden lg:block">
                <Logo color="orange" variant="angled2" width={244} height={325} />
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
};

const FooterContactSection = ({
  organisationSettings,
}: Pick<FooterProps, "organisationSettings">) => {
  const { address, phoneNumber, email, socialMediaLinks } = organisationSettings ?? {};

  return (
    <div className="flex flex-1 flex-col gap-md">
      <p className="text-body-small text-text-white-secondary">Contact</p>

      <div className="flex flex-col gap-xs lg:gap-sm">
        {/* Address */}
        {address && (
          <address className="text-body not-italic">
            {address.street}
            <br />
            {address.zipCode} {address.city}
          </address>
        )}

        {/* Email and phone - 44px touch targets on mobile */}
        <div className="flex flex-col">
          {email && (
            <UnderlineLink href={`mailto:${email}`} className="h-11 lg:h-auto">
              {email}
            </UnderlineLink>
          )}
          {phoneNumber && (
            <UnderlineLink href={`tel:${phoneNumber}`} className="h-11 lg:h-auto">
              {phoneNumber}
            </UnderlineLink>
          )}
        </div>

        {/* Social media - 44px touch targets on mobile */}
        {socialMediaLinks && socialMediaLinks.length > 0 && (
          <div className="flex flex-col">
            {socialMediaLinks.map((link) => (
              <ExternalLinkWithArrow
                key={link._key}
                href={link.url}
                title={link.title}
                className="h-11 lg:h-auto"
              />
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
    <div className="flex flex-1 flex-col gap-md">
      <p className="text-body-small text-text-white-secondary">Links</p>

      <div className="flex flex-col">
        {footerLinks.map((link) => {
          if (link.linkType === "internal" && link.slug) {
            return (
              <LinkResolver
                key={link._key}
                linkType="internal"
                slug={link.slug}
                _type={link._type}
                className="flex h-11 w-fit items-center text-body transition-colors lg:h-auto"
              >
                <span className="border-b border-stroke-soft-inverted transition-colors hover:border-white">
                  {link.title}
                </span>
              </LinkResolver>
            );
          }

          if (link.linkType === "external") {
            return (
              <ExternalLinkWithArrow
                key={link._key}
                href={link.url}
                title={link.title}
                className="h-11 lg:h-auto"
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

type FooterCertificationsSectionProps = Pick<FooterProps, "organisationSettings"> & {
  layout?: "horizontal" | "vertical";
};

const FooterCertificationsSection = ({
  organisationSettings,
  layout = "horizontal",
}: FooterCertificationsSectionProps) => {
  const { certifications } = organisationSettings ?? {};

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-md">
      <p className="text-body-small text-text-white-secondary">Certifications</p>

      <div
        className={cn(
          "flex items-center",
          layout === "horizontal" ? "flex-wrap gap-x-md gap-y-2xs" : "flex-col items-start gap-2xs",
        )}
      >
        {certifications.map((cert) => (
          <div key={cert._key} className="flex items-center gap-2xs">
            {cert.logo?.url && (
              <Image
                src={cert.logo.url}
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
  <a href={href} className={cn("flex w-fit items-center text-body transition-colors", className)}>
    <span className="border-b border-stroke-soft-inverted transition-colors hover:border-white">
      {children}
    </span>
  </a>
);

const ExternalLinkWithArrow = ({
  href,
  title,
  className,
}: {
  href: string;
  title: string;
  className?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn("group flex w-fit items-center gap-3xs text-body transition-colors", className)}
  >
    <span className="border-b border-stroke-soft-inverted transition-colors group-hover:border-white">
      {title}
    </span>
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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

const FooterNewsletterSection = ({
  newsletterText,
  newsletterForm,
}: {
  newsletterText?: string | null;
  newsletterForm?: { _id: string; title: string | null; formId: string | null } | null;
}) => {
  if (!newsletterForm?.formId) {
    return null;
  }

  return (
    <div className="flex max-w-[540px] flex-1 flex-col gap-xs">
      {newsletterText && <p className="text-body text-text-white-primary">{newsletterText}</p>}
      <NewsletterForm formId={newsletterForm.formId} />
    </div>
  );
};
