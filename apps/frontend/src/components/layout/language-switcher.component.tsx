"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getTranslatedUrl } from "@/server/actions/get-translated-url.action";
import { cn } from "@/utils/cn.util";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "footer";
}

export function LanguageSwitcher({ className, variant = "default" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = async (targetLocale: string) => {
    if (targetLocale === locale) return;

    // Remove locale prefix if present to get the internal path
    const pathWithoutLocale = pathname.replace(/^\/(no|en)/, "") || "/";

    // Extract the slug (last segment for dynamic routes)
    const segments = pathWithoutLocale.split("/").filter(Boolean);
    const slug = segments[segments.length - 1] || "";

    // Get the translated URL from the server
    const result = await getTranslatedUrl(slug, locale, targetLocale);

    // Build the full URL with locale prefix (except for Norwegian which is default)
    const localePrefix = targetLocale === "no" ? "" : `/${targetLocale}`;
    const targetUrl = `${localePrefix}${result.url}`;

    router.replace(targetUrl);
  };

  if (variant === "footer") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            className={cn(
              "flex size-8 items-center justify-center rounded text-body transition-colors",
              locale === loc
                ? "bg-orange text-text-primary"
                : "text-text-white-primary hover:text-orange",
            )}
            aria-current={locale === loc ? "page" : undefined}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "px-2 py-1 text-sm rounded transition-colors",
            locale === loc
              ? "font-bold text-purple bg-light-purple"
              : "text-gray-600 hover:text-purple",
          )}
          aria-current={locale === loc ? "page" : undefined}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
