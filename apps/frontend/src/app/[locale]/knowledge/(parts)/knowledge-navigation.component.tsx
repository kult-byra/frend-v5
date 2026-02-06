"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn.util";

type KnowledgeNavigationProps = {
  translations: {
    all?: string | null;
    caseStudies?: string | null;
    articlesAndInsights?: string | null;
    seminars?: string | null;
    ebooks?: string | null;
  };
};

const NAV_ITEMS = [
  { href: "/knowledge", labelKey: "all", segments: ["knowledge", "kunnskap"] },
  {
    href: "/knowledge/case-studies",
    labelKey: "caseStudies",
    segments: ["case-studies", "prosjekter"],
  },
  {
    href: "/knowledge/articles",
    labelKey: "articlesAndInsights",
    segments: ["articles", "artikler"],
  },
  { href: "/knowledge/seminars", labelKey: "seminars", segments: ["seminars", "seminarer"] },
  { href: "/knowledge/ebooks", labelKey: "ebooks", segments: ["ebooks", "e-boker"] },
] as const;

// All known archive segments (both EN and NO translations)
const ARCHIVE_SEGMENTS = new Set([
  "knowledge",
  "kunnskap",
  "case-studies",
  "prosjekter",
  "articles",
  "artikler",
  "seminars",
  "seminarer",
  "ebooks",
  "e-boker",
]);

export function KnowledgeNavigation({ translations }: KnowledgeNavigationProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Hide navigation on detail pages (when the last segment is a slug, not an archive segment)
  // Path structure: /[locale]/knowledge/[optional-category]/[slug]
  const lastSegment = pathSegments[pathSegments.length - 1];
  const isDetailPage = lastSegment && !ARCHIVE_SEGMENTS.has(lastSegment);

  if (isDetailPage) {
    return null;
  }

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    // For "All" tab, match exact /knowledge or /kunnskap (with or without locale prefix)
    if (item.labelKey === "all") {
      const lastSegment = pathSegments[pathSegments.length - 1];
      return lastSegment === "knowledge" || lastSegment === "kunnskap";
    }

    // For subpages, check if any of the segments match
    return item.segments.some((segment) => pathname.includes(`/${segment}`));
  };

  const getLabel = (labelKey: string) => {
    return translations[labelKey as keyof typeof translations] ?? labelKey;
  };

  return (
    <div className="relative flex gap-xs overflow-x-auto">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 whitespace-nowrap border-b-2 pb-3xs pt-xs text-[20px] font-semibold leading-[1.3] transition-colors lg:pt-0",
              active
                ? "border-text-primary text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            {getLabel(item.labelKey)}
          </Link>
        );
      })}
      {/* Fade gradient for overflow */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-10 bg-linear-to-r from-transparent to-white" />
    </div>
  );
}
