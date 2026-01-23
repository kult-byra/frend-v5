"use client";

import { resolvePath } from "@workspace/routing/src/resolve-path";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon.component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Img } from "@/components/utils/img.component";
import { cn } from "@/utils/cn.util";
import type { LinkGroupProps, MainMenuProps, SecondaryMenuProps } from "./menu.types";
import { NavBadge } from "./nav-badge.component";

type CollapsedMenuProps = {
  mainMenu: MainMenuProps;
  secondaryMenu: SecondaryMenuProps;
  newsEventsCount: number;
};

export const CollapsedMenu = (props: CollapsedMenuProps) => {
  const { mainMenu, secondaryMenu, newsEventsCount } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showContactWidget, setShowContactWidget] = useState(false);

  // Find the active link group
  const activeLinkGroup = mainMenu?.find(
    (item): item is LinkGroupProps => item.linkType === "linkGroup" && item._key === activeCategory,
  );

  // Find the contact link group (can be in mainMenu or secondaryMenu)
  const contactLinkGroup =
    mainMenu?.find(
      (item): item is LinkGroupProps =>
        item.linkType === "linkGroup" && item.menuType === "contact",
    ) ??
    secondaryMenu?.find(
      (item): item is LinkGroupProps =>
        item.linkType === "linkGroup" && item.menuType === "contact",
    );

  // Filter out contact-type linkGroups from the regular menu
  const regularLinkGroups = mainMenu?.filter(
    (item) => !(item.linkType === "linkGroup" && item.menuType === "contact"),
  );

  // Set first non-contact linkGroup as default when opening
  const handleOpen = () => {
    setIsOpen(true);
    setShowContactWidget(false);
    const firstLinkGroup = regularLinkGroups?.find((item) => item.linkType === "linkGroup");
    if (firstLinkGroup) {
      setActiveCategory(firstLinkGroup._key);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveCategory(null);
    setShowContactWidget(false);
  };

  const handleContactClick = () => {
    setShowContactWidget(true);
    setActiveCategory(null);
  };

  const mainLinks = activeLinkGroup?.links?.mainLinks ?? [];
  const linkGroupSecondaryLinks = activeLinkGroup?.links?.secondaryLinks ?? [];

  return (
    <div className="laptop:hidden">
      {/* Menu trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Åpne meny"
        className="backdrop-blur-[5px] bg-container-shade rounded px-2xs py-3xs text-body text-text-primary"
      >
        Meny
      </button>

      {/* Fullscreen overlay */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex min-h-dvh flex-col",
            showContactWidget ? "bg-container-overlay-primary-2" : "bg-light-purple",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-xs py-2xs h-[52px]">
            <Link href="/" onClick={handleClose} className="font-semibold text-lg">
              frend
            </Link>
            <div className="flex items-center gap-xs">
              {/* Contact badge - only show if contact linkGroup exists */}
              {contactLinkGroup && (
                <button
                  type="button"
                  onClick={handleContactClick}
                  className={cn(
                    "rounded px-2xs py-3xs text-body text-text-primary",
                    showContactWidget
                      ? "bg-container-brand-1 text-text-white-primary"
                      : "bg-container-shade backdrop-blur-[5px]",
                  )}
                >
                  {contactLinkGroup.title}
                </button>
              )}
              {/* Close button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Lukk meny"
                className="size-8 flex items-center justify-center"
              >
                <Icon name="close" className="size-5" />
              </button>
            </div>
          </div>

          {/* Category badges row - only show when not in contact view */}
          {!showContactWidget && (
            <div className="flex items-center gap-2xs px-xs py-2xs border-y border-stroke-soft overflow-x-auto">
              {regularLinkGroups?.map((item) => {
                if (item.linkType !== "linkGroup") return null;
                return (
                  <NavBadge
                    key={item._key}
                    item={item}
                    isActive={activeCategory === item._key}
                    onClick={() => {
                      setActiveCategory(item._key);
                      setShowContactWidget(false);
                    }}
                    notificationCount={
                      item.menuType === "newsAndEvents" ? newsEventsCount : undefined
                    }
                  />
                );
              })}
            </div>
          )}

          {/* Regular menu content */}
          {!showContactWidget && (
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-md px-xs pb-xs pt-sm">
                {/* Main links - large headings */}
                {mainLinks.length > 0 && (
                  <div className="flex flex-col gap-sm">
                    {mainLinks.map((link) => {
                      const href = getLinkHref(link);
                      if (!href) return null;
                      return (
                        <Link
                          key={link._key}
                          href={href}
                          onClick={handleClose}
                          className="text-headline-2 text-text-primary"
                        >
                          {link.title}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Link group secondary links */}
                {linkGroupSecondaryLinks.length > 0 && (
                  <div className="flex flex-col gap-sm">
                    {linkGroupSecondaryLinks.map((link) => {
                      const href = getLinkHref(link);
                      if (!href) return null;
                      return (
                        <Link
                          key={link._key}
                          href={href}
                          onClick={handleClose}
                          className="text-body-large text-text-primary"
                        >
                          {link.title}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Secondary menu items (About us, Careers, etc.) */}
                {secondaryMenu && secondaryMenu.length > 0 && (
                  <div className="flex flex-col gap-sm border-t border-stroke-soft pt-sm">
                    {secondaryMenu.map((item) => {
                      const href = getMenuItemHref(item);
                      if (!href) return null;
                      return (
                        <Link
                          key={item._key}
                          href={href}
                          onClick={handleClose}
                          className="text-body-large text-text-primary"
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Contact widget content */}
          {showContactWidget && contactLinkGroup && (
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-md px-xs py-sm">
                {/* Link groups and image row */}
                {(contactLinkGroup.linkGroups?.length || contactLinkGroup.image) && (
                  <div className="flex gap-sm">
                    {/* Link groups column */}
                    {contactLinkGroup.linkGroups && contactLinkGroup.linkGroups.length > 0 && (
                      <div className="flex flex-1 flex-col gap-md">
                        {contactLinkGroup.linkGroups.map((group) => (
                          <div key={group._key} className="flex flex-col gap-2xs">
                            <h3 className="text-headline-3 text-text-primary">{group.title}</h3>
                            {group.links && group.links.length > 0 && (
                              <div className="flex flex-col gap-2xs">
                                {group.links.map((link) => {
                                  const href = getContactLinkHref(link);
                                  if (!href) return null;
                                  return (
                                    <Link
                                      key={link._key}
                                      href={href}
                                      onClick={handleClose}
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
                    {contactLinkGroup.image?.asset && (
                      <div className="aspect-[3/4] h-[186px] shrink-0 overflow-hidden rounded-3xs">
                        <Img
                          {...contactLinkGroup.image}
                          sizes={{ md: "third" }}
                          className="h-full w-full"
                          cover
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Contact form section */}
                {contactLinkGroup.contactForm && (
                  <div className="flex flex-col gap-xs">
                    <div className="flex flex-col gap-2xs">
                      <h3 className="text-headline-3 text-text-primary">Collaborate?</h3>
                      <p className="text-body text-text-primary">
                        Fill out the form below and we'll get back to you.
                      </p>
                    </div>

                    <form className="flex flex-col gap-2xs">
                      <Input type="text" placeholder="Name" className="h-[55px] border-0" />
                      <div className="flex gap-2xs">
                        <Input
                          type="email"
                          placeholder="Email"
                          className="h-[55px] flex-1 border-0"
                        />
                        <Input
                          type="tel"
                          placeholder="Phone"
                          className="h-[55px] flex-1 border-0"
                        />
                      </div>
                      <Textarea
                        placeholder="Message"
                        className="h-[120px] resize-none border-0"
                        rows={4}
                      />
                      <Button type="submit" className="w-fit">
                        Send
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
};

type LinkItem = NonNullable<NonNullable<LinkGroupProps["links"]>["mainLinks"]>[number];

function getLinkHref(link: LinkItem): string | null {
  if (link.linkType === "internal" && link._type) {
    return resolvePath(link._type, link.slug ? { slug: link.slug } : {});
  }
  if (link.linkType === "external" && "url" in link) {
    return link.url;
  }
  return null;
}

function getMenuItemHref(item: NonNullable<MainMenuProps>[number]): string | null {
  if (item.linkType === "internal" && item._type) {
    return resolvePath(item._type, item.slug ? { slug: item.slug } : {});
  }
  if (item.linkType === "external" && "url" in item) {
    return item.url;
  }
  return null;
}

type ContactLinkItem = NonNullable<
  NonNullable<LinkGroupProps["linkGroups"]>[number]["links"]
>[number];

function getContactLinkHref(link: ContactLinkItem): string | null {
  if (link.linkType === "internal" && link._type) {
    return resolvePath(link._type, link.slug ? { slug: link.slug } : {});
  }
  if (link.linkType === "external" && "url" in link) {
    return link.url;
  }
  return null;
}
