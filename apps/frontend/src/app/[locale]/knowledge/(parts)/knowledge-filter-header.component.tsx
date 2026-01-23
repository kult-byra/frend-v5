"use client";

import { parseAsString, useQueryState } from "nuqs";
import { cn } from "@/utils/cn.util";

// Content type categories for the knowledge hub
const CONTENT_TYPES = [
  { value: null, labelKey: "all" },
  { value: "caseStudy", labelKey: "caseStudies" },
  { value: "knowledgeArticle", labelKey: "articlesAndInsights" },
  { value: "seminar", labelKey: "seminars" },
  { value: "eBook", labelKey: "ebooks" },
] as const;

type ServiceItem = {
  _id: string;
  title: string | null;
  slug: string | null;
};

type StringTranslations = {
  all?: string | null;
  filtersAndSort?: string | null;
  caseStudies?: string | null;
  articlesAndInsights?: string | null;
  seminars?: string | null;
  ebooks?: string | null;
};

type KnowledgeFilterHeaderProps = {
  services: ServiceItem[];
  translations: StringTranslations;
};

export function KnowledgeFilterHeader({ services, translations }: KnowledgeFilterHeaderProps) {
  const [contentType, setContentType] = useQueryState(
    "type",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );
  const [serviceFilter, setServiceFilter] = useQueryState(
    "service",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );

  const getLabel = (labelKey: string): string => {
    const key = labelKey as keyof StringTranslations;
    return translations[key] ?? labelKey;
  };

  return (
    <div className="flex flex-col gap-md pb-xs pt-md">
      {/* Content type tabs - top row */}
      <div className="relative flex flex-wrap gap-xs overflow-x-auto">
        {CONTENT_TYPES.map((type) => {
          const isActive = type.value === null ? contentType === "" : contentType === type.value;
          return (
            <button
              key={type.value ?? "all"}
              type="button"
              onClick={() => setContentType(type.value ?? "")}
              className={cn(
                "shrink-0 whitespace-nowrap pb-3xs text-[20px] font-semibold leading-[1.3] transition-colors",
                isActive
                  ? "border-b-2 border-text-primary text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {getLabel(type.labelKey)}
            </button>
          );
        })}
        {/* Fade gradient for overflow */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white" />
      </div>

      {/* Service filters and Filters & Sort button - bottom row */}
      <div className="flex items-end gap-xs">
        {/* Service filter pills */}
        <div className="flex flex-1 flex-wrap gap-1">
          {/* All services pill */}
          <button
            type="button"
            onClick={() => setServiceFilter("")}
            className={cn(
              "rounded px-xs py-2xs text-body-small transition-colors",
              serviceFilter === ""
                ? "bg-container-brand-2 text-text-primary"
                : "bg-container-shade text-text-primary hover:bg-container-secondary",
            )}
          >
            {translations.all ?? "All"}
          </button>

          {/* Dynamic service pills */}
          {services.map((service) => {
            if (!service.title || !service.slug) return null;
            const isActive = serviceFilter === service.slug;
            return (
              <button
                key={service._id}
                type="button"
                onClick={() => setServiceFilter(isActive ? "" : (service.slug ?? ""))}
                className={cn(
                  "rounded px-xs py-2xs text-body-small transition-colors",
                  isActive
                    ? "bg-container-brand-2 text-text-primary"
                    : "bg-container-shade text-text-primary hover:bg-container-secondary",
                )}
              >
                {service.title}
              </button>
            );
          })}
        </div>

        {/* Filters & Sort button */}
        <button
          type="button"
          className="flex shrink-0 items-center gap-3xs text-base leading-[1.45] text-text-primary"
        >
          <span>{translations.filtersAndSort ?? "Filters & Sort"}</span>
          <span>+</span>
        </button>
      </div>
    </div>
  );
}

// Export the content types for use in filtering logic
export { CONTENT_TYPES };
