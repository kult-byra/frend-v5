"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/utils/cn.util";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

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
