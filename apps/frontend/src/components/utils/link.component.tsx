"use client";

import { localizePath } from "@workspace/routing/src/resolve-path";
import type { Locale } from "@workspace/routing/src/route.config";
import NextLink from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ href, ...props }: LinkProps) {
  const locale = useLocale() as Locale;

  if (typeof href === "string" && href.startsWith("/")) {
    return <NextLink href={localizePath(href, locale)} {...props} />;
  }

  return <NextLink href={href} {...props} />;
}
