"use client";

import { useState } from "react";
import { Icon } from "@/components/icon.component";
import { cn } from "@/utils/cn.util";

type ProfileLink = {
  _key: string;
  title: string | null;
  url: string | null;
};

type ExpertiseItem = {
  _id: string;
  _type: string;
  title: string | null;
};

type PersonInfoWidgetProps = {
  phone?: string | null;
  email?: string | null;
  profileLinks?: ProfileLink[] | null;
  expertise?: ExpertiseItem[] | null;
  className?: string;
};

export function PersonInfoWidget({
  phone,
  email,
  profileLinks,
  expertise,
  className,
}: PersonInfoWidgetProps) {
  const hasContactInfo = phone || email || (profileLinks && profileLinks.length > 0);
  const hasExpertise = expertise && expertise.length > 0;

  if (!hasContactInfo && !hasExpertise) return null;

  return (
    <div className={cn("flex flex-col rounded-3xs bg-container-secondary", className)}>
      {hasContactInfo && (
        <CollapsibleSection title="Kontaktinfo" defaultOpen>
          <div className="grid grid-cols-2 gap-2xs">
            <div className="flex flex-col gap-2xs">
              {phone && (
                <ExternalLink href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</ExternalLink>
              )}
              {email && <ExternalLink href={`mailto:${email}`}>{email}</ExternalLink>}
            </div>
            <div className="flex flex-col gap-2xs">
              {profileLinks?.map(
                (link) =>
                  link.title &&
                  link.url && (
                    <ExternalLink key={link._key} href={link.url} external>
                      {link.title}
                    </ExternalLink>
                  ),
              )}
            </div>
          </div>
        </CollapsibleSection>
      )}

      {hasContactInfo && hasExpertise && <Separator />}

      {hasExpertise && (
        <CollapsibleSection title="Ekspertise" defaultOpen>
          <div className="flex flex-wrap gap-3xs">
            {expertise.map((item) => item.title && <TagPill key={item._id}>{item.title}</TagPill>)}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-3xs pb-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-xs pl-xs pr-2xs pt-2xs"
      >
        <span className="pt-3xs text-base font-semibold leading-[145%] text-primary">{title}</span>
        <div className="flex size-8 items-center justify-center">
          <Icon name={isOpen ? "lg-collapse" : "lg-expand"} className="size-4 text-primary" />
        </div>
      </button>
      {isOpen && <div className="px-xs">{children}</div>}
    </div>
  );
}

type ExternalLinkProps = {
  href: string;
  external?: boolean;
  children: React.ReactNode;
};

function ExternalLink({ href, external, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex w-fit items-center gap-3xs border-b border-stroke-soft text-base leading-[145%] text-primary transition-colors hover:text-button-secondary-text-hover"
    >
      <span>{children}</span>
      {external && <Icon name="sm-arrow-top-right" className="size-[10px]" />}
    </a>
  );
}

function Separator() {
  return (
    <div className="px-xs">
      <div className="h-px rounded-[1px] bg-stroke-soft" />
    </div>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-container-primary px-3 py-3xs text-xs leading-[145%] text-primary">
      {children}
    </span>
  );
}
