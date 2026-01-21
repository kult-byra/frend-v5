"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LinkResolver } from "@/components/utils/link-resolver.component";

import { cn } from "@/utils/cn.util";
import type { MenuItemProps } from "./menu.types";
import { useIsLinkTypeActive } from "./use-is-link-active.hook";

export const MenuItem = (props: MenuItemProps) => {
  const { linkType, title } = props;

  const isActive = useIsLinkTypeActive(props);

  return (
    <NavigationMenuItem>
      {linkType === "linkGroup" ? (
        <LinkGroup {...props} />
      ) : (
        <NavigationMenuLink
          asChild
          className={navigationMenuTriggerStyle()}
          aria-current={isActive ? "page" : undefined}
        >
          <LinkResolver {...props}>{title}</LinkResolver>
        </NavigationMenuLink>
      )}
    </NavigationMenuItem>
  );
};

type LinkGroupProps = Extract<MenuItemProps, { linkType: "linkGroup" }>;

const LinkGroup = (props: LinkGroupProps) => {
  const { title } = props;

  return (
    <>
      {/* DESKTOP (dropdown in shared viewport) */}
      <NavigationMenuTrigger className="hidden laptop:flex">{title}</NavigationMenuTrigger>
      <LinkGroupContent className="hidden laptop:block" {...props} />

      {/* MOBILE (dropdown inside item) */}
      <NavigationMenu orientation="vertical" className="laptop:hidden flex-col items-start">
        <NavigationMenuTrigger>{title}</NavigationMenuTrigger>

        <LinkGroupContent {...props} />
      </NavigationMenu>
    </>
  );
};

const LinkGroupContent = (props: LinkGroupProps & { className?: string }) => {
  const { links, className } = props;

  const mainLinks = links?.mainLinks ?? [];

  if (mainLinks.length === 0) return null;

  return (
    <NavigationMenuContent className={className}>
      <ul className="laptop:p-[0.5em] grid md:grid-cols-2 gap-1 rounded-md">
        {mainLinks.map((link) => (
          <li key={link._key}>
            <NavigationMenuLink asChild>
              <LinkResolver
                {...link}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex-col gap-y-[0.25em] items-start w-full h-full justify-start px-[1em] laptop:px-[1.35em] laptop:py-[1em]",
                )}
              >
                <span className="font-medium">{link.title}</span>

                {link.description && <span className="opacity-60">{link.description}</span>}
              </LinkResolver>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </NavigationMenuContent>
  );
};
