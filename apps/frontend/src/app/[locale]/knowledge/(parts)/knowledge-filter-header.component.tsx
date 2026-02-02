"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { cn } from "@/utils/cn.util";
import { KnowledgeFilterDialog } from "./knowledge-filter-dialog.component";

type ServiceItem = {
  _id: string;
  title: string | null;
  slug: string | null;
};

type FilterItem = {
  _id: string;
  title: string | null;
};

type StringTranslations = {
  all?: string | null;
  filtersAndSort?: string | null;
  filters?: string | null;
  sorting?: string | null;
  technologies?: string | null;
  industries?: string | null;
  applyFilters?: string | null;
  clearAll?: string | null;
  newestFirst?: string | null;
  oldestFirst?: string | null;
};

type KnowledgeFilterHeaderProps = {
  services: ServiceItem[];
  technologies: FilterItem[];
  industries: FilterItem[];
  translations: StringTranslations;
};

export function KnowledgeFilterHeader({
  services,
  technologies,
  industries,
  translations,
}: KnowledgeFilterHeaderProps) {
  const [serviceFilter, setServiceFilter] = useQueryState(
    "service",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );
  const [technologyFilters, setTechnologyFilters] = useQueryState(
    "tech",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: false }),
  );
  const [industryFilters, setIndustryFilters] = useQueryState(
    "industry",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: false }),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sort",
    parseAsString.withDefault("newest").withOptions({ shallow: false }),
  );

  const handleApplyFilters = (filters: {
    technologies: string[];
    industries: string[];
    sortOrder: "newest" | "oldest";
  }) => {
    setTechnologyFilters(filters.technologies.length > 0 ? filters.technologies : null);
    setIndustryFilters(filters.industries.length > 0 ? filters.industries : null);
    setSortOrder(filters.sortOrder === "newest" ? null : filters.sortOrder);
  };

  return (
    <div className="flex flex-col gap-xs lg:flex-row lg:items-end">
      {/* Service filter pills */}
      <div className="flex flex-1 flex-wrap gap-1">
        {/* All services pill */}
        <button
          type="button"
          onClick={() => setServiceFilter("")}
          className={cn(
            "h-11 rounded px-xs text-body-small transition-colors lg:h-auto lg:py-2xs",
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
                "h-11 rounded px-xs text-body-small transition-colors lg:h-auto lg:py-2xs",
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

      {/* Filters & Sort dialog trigger */}
      <KnowledgeFilterDialog
        technologies={technologies}
        industries={industries}
        translations={translations}
        selectedTechnologies={technologyFilters}
        selectedIndustries={industryFilters}
        sortOrder={(sortOrder as "newest" | "oldest") || "newest"}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
