"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn.util";

type CurrentNavigationProps = {
  translations: {
    news?: string | null;
    events?: string | null;
  };
};

export function CurrentNavigation({ translations }: CurrentNavigationProps) {
  const pathname = usePathname();

  // Check for news: matches /news, /nyheter (Norwegian translation)
  const isNewsActive = pathname.includes("/news") || pathname.includes("/nyheter");
  // Check for events: matches /events, /arrangementer (Norwegian translation)
  const isEventsActive = pathname.includes("/events") || pathname.includes("/arrangementer");

  return (
    <div className="relative flex gap-xs overflow-x-auto">
      <Link
        href="/current/news"
        aria-current={isNewsActive ? "page" : undefined}
        className={cn(
          "shrink-0 whitespace-nowrap border-b-2 pb-3xs pt-xs text-[20px] font-semibold leading-[1.3] transition-colors lg:pt-0",
          isNewsActive
            ? "border-text-primary text-text-primary"
            : "border-transparent text-text-secondary hover:text-text-primary",
        )}
      >
        {translations.news ?? "News"}
      </Link>
      <Link
        href="/current/events"
        aria-current={isEventsActive ? "page" : undefined}
        className={cn(
          "shrink-0 whitespace-nowrap border-b-2 pb-3xs pt-xs text-[20px] font-semibold leading-[1.3] transition-colors lg:pt-0",
          isEventsActive
            ? "border-text-primary text-text-primary"
            : "border-transparent text-text-secondary hover:text-text-primary",
        )}
      >
        {translations.events ?? "Events"}
      </Link>
      {/* Fade gradient for overflow */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-10 bg-linear-to-r from-transparent to-white" />
    </div>
  );
}
