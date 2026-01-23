"use client";

import Link from "next/link";
import { Icon } from "@/components/icon.component";
import { Img } from "@/components/utils/img.component";
import { cn } from "@/utils/cn.util";
import { getLinkHref } from "./link-href.util";
import type { LinkGroupProps } from "./menu.types";

type ContactWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
  linkGroup: LinkGroupProps | undefined;
};

export const ContactWidget = (props: ContactWidgetProps) => {
  const { isOpen, onClose, linkGroup } = props;

  // Escape key and click outside are handled by parent Menu component

  if (!linkGroup || linkGroup.menuType !== "contact") return null;

  const { linkGroups, contactForm, image } = linkGroup;

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-50 w-full max-w-[475px] bg-container-overlay-primary-2 transition-transform duration-200 ease-out",
        isOpen ? "translate-y-0" : "translate-y-full",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Contact widget"
    >
      {/* Close button row */}
      <div className="flex items-center justify-end pb-2xs pl-xs pr-2xs pt-2xs">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact widget"
          className="flex size-8 items-center justify-center"
        >
          <Icon name="close" className="size-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-md px-xs pb-xs">
        {/* Link groups and image row */}
        {(linkGroups?.length || image) && (
          <div className="flex gap-sm">
            {/* Link groups column */}
            {linkGroups && linkGroups.length > 0 && (
              <div className="flex flex-1 flex-col gap-md">
                {linkGroups.map((group) => (
                  <div key={group._key} className="flex flex-col gap-2xs">
                    <h3 className="text-headline-3 text-text-primary">{group.title}</h3>
                    {group.links && group.links.length > 0 && (
                      <div className="flex flex-col gap-2xs">
                        {group.links.map((link) => {
                          const href = getLinkHref(link);
                          if (!href) return null;
                          return (
                            <Link
                              key={link._key}
                              href={href}
                              onClick={onClose}
                              className="w-fit border-b border-stroke-soft text-body text-text-primary transition-colors hover:text-button-primary-hover"
                            >
                              {link.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Image */}
            {image?.asset && (
              <div className="aspect-[3/4] h-[186px] shrink-0 overflow-hidden rounded-3xs">
                <Img {...image} sizes={{ md: "third" }} className="h-full w-full" cover />
              </div>
            )}
          </div>
        )}

        {/* Contact form section - TODO: Replace with HubSpot form component */}
        {contactForm && (
          <div className="flex flex-col gap-2xs rounded-3xs bg-container-primary p-xs">
            <p className="text-body-small text-text-secondary">HubSpot form placeholder</p>
            <p className="text-body-small text-text-secondary">Form ID: {contactForm._id}</p>
          </div>
        )}
      </div>
    </div>
  );
};
