import { pathnames } from "@workspace/routing";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["no", "en"],
  defaultLocale: "no",
  localePrefix: "as-needed",
  pathnames,
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof pathnames;
