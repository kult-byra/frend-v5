"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/utils/cn.util";
import { getLinkHref } from "./link-href.util";
import type { LinkGroupProps } from "./menu.types";

type NavPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  linkGroup: LinkGroupProps | undefined;
};

export const NavPanel = forwardRef<HTMLElement, NavPanelProps>((props, ref) => {
  const { isOpen, onClose, onMouseLeave, linkGroup } = props;

  const mainLinks = linkGroup?.links?.mainLinks ?? [];
  const secondaryLinks = linkGroup?.links?.secondaryLinks ?? [];

  return (
    <section
      ref={ref}
      onMouseLeave={onMouseLeave}
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden min-w-[560px] bg-light-purple laptop:block",
        isOpen ? "visible" : "invisible",
      )}
      style={{
        // Extend width to cover the nav area - calculated from logo + nav buttons
        // Using CSS calc to get width of primary nav + logo area + padding
        width: "var(--nav-panel-width, 560px)",
      }}
      aria-label={linkGroup ? `${linkGroup.title} navigation` : "Navigation panel"}
    >
      {/* Panel content - offset by header height */}
      <div className="flex h-full flex-col justify-between px-xs pb-xs pt-[calc(52px+var(--spacing-sm))]">
        <div className="flex flex-col gap-lg">
          {/* Main links - large headings */}
          {mainLinks.length > 0 && (
            <div className="flex flex-col gap-sm">
              {mainLinks.map((link) => (
                <PanelMainLink key={link._key} link={link} onClose={onClose} />
              ))}
            </div>
          )}

          {/* Secondary links - smaller text */}
          {secondaryLinks.length > 0 && (
            <div className="flex flex-col gap-sm">
              {secondaryLinks.map((link) => (
                <PanelSecondaryLink key={link._key} link={link} onClose={onClose} />
              ))}
            </div>
          )}
        </div>

        {/* TODO: Featured article card at bottom */}
      </div>
    </section>
  );
});

NavPanel.displayName = "NavPanel";

type MainLinksArray = NonNullable<NonNullable<LinkGroupProps["links"]>["mainLinks"]>;
type PanelLinkProps = {
  link: MainLinksArray[number];
  onClose: () => void;
};

const PanelMainLink = ({ link, onClose }: PanelLinkProps) => {
  const href = getLinkHref(link);
  if (!href) return null;

  return (
    <Link
      href={href}
      onClick={onClose}
      className="text-headline-2 text-text-primary hover:opacity-70 transition-opacity"
    >
      {link.title}
    </Link>
  );
};

const PanelSecondaryLink = ({ link, onClose }: PanelLinkProps) => {
  const href = getLinkHref(link);
  if (!href) return null;

  return (
    <Link
      href={href}
      onClick={onClose}
      className="text-body-large text-text-primary hover:opacity-70 transition-opacity"
    >
      {link.title}
    </Link>
  );
};
