"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { cn } from "@/utils/cn.util";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "footer";
}

export function LanguageSwitcher({ className, variant = "default" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (targetLocale: string) => {
    if (targetLocale === locale) return;

    // Remove current locale prefix to get the path
    const pathWithoutLocale = pathname.replace(/^\/(no|en)/, "") || "/";

    // Build new URL with target locale prefix
    // We always include the locale prefix when switching to force the middleware
    // to use the correct locale (even for Norwegian which is the default)
    const newPath = `/${targetLocale}${pathWithoutLocale}`;

    // Use window.location to force a full page navigation
    // This ensures the middleware processes the locale change
    window.location.href = newPath;
  };

  if (variant === "footer") {
    return (
      <div className={cn("flex items-center gap-3xs", className)}>
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded text-body transition-colors",
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
    <div className={cn("flex items-center gap-2xs", className)}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "cursor-pointer px-2xs py-3xs text-sm rounded transition-colors",
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
