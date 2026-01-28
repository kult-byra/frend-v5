"use client";

import { useState } from "react";
import { Icon } from "@/components/icon.component";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn.util";

type FilterItem = {
  _id: string;
  title: string | null;
};

type SortOption = "newest" | "oldest";

type FilterDialogTranslations = {
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

type KnowledgeFilterDialogProps = {
  technologies: FilterItem[];
  industries: FilterItem[];
  translations: FilterDialogTranslations;
  selectedTechnologies: string[];
  selectedIndustries: string[];
  sortOrder: SortOption;
  onApply: (filters: {
    technologies: string[];
    industries: string[];
    sortOrder: SortOption;
  }) => void;
};

export function KnowledgeFilterDialog({
  technologies,
  industries,
  translations,
  selectedTechnologies,
  selectedIndustries,
  sortOrder,
  onApply,
}: KnowledgeFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [localTechnologies, setLocalTechnologies] = useState<string[]>(selectedTechnologies);
  const [localIndustries, setLocalIndustries] = useState<string[]>(selectedIndustries);
  const [localSortOrder, setLocalSortOrder] = useState<SortOption>(sortOrder);

  // Reset local state when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalTechnologies(selectedTechnologies);
      setLocalIndustries(selectedIndustries);
      setLocalSortOrder(sortOrder);
    }
    setOpen(isOpen);
  };

  const toggleTechnology = (id: string) => {
    setLocalTechnologies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const toggleIndustry = (id: string) => {
    setLocalIndustries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    onApply({
      technologies: localTechnologies,
      industries: localIndustries,
      sortOrder: localSortOrder,
    });
    setOpen(false);
  };

  const handleClearAll = () => {
    setLocalTechnologies([]);
    setLocalIndustries([]);
    setLocalSortOrder("newest");
  };

  const hasActiveFilters =
    selectedTechnologies.length > 0 || selectedIndustries.length > 0 || sortOrder !== "newest";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-11 shrink-0 items-center gap-3xs text-base leading-[1.45] text-text-primary lg:h-auto"
        >
          <span>{translations.filtersAndSort ?? "Filters & Sort"}</span>
          <span className="flex size-5 items-center justify-center">
            {hasActiveFilters ? (
              <span className="size-2 rounded-full bg-container-brand-2" />
            ) : (
              <Icon name="expand" size="sm" />
            )}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent hideClose className="max-w-[672px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-xs pb-2xs pt-2xs">
          <DialogTitle className="pt-3xs text-base font-semibold leading-[1.45] text-text-primary">
            {translations.filters ?? "Filters"}
          </DialogTitle>
          <DialogClose className="flex size-8 items-center justify-center rounded transition-opacity hover:opacity-70">
            <Icon name="close" size="sm" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-md">
          {/* Sorting section */}
          <div className="px-xs pb-3xs pt-2xs">
            <h3 className="pt-2xs text-base font-semibold leading-[1.45] text-text-primary">
              {translations.sorting ?? "Sorting"}
            </h3>
          </div>
          <div className="px-xs pb-xs">
            <div className="flex flex-wrap gap-1">
              <SortDropdown
                value={localSortOrder}
                onChange={setLocalSortOrder}
                newestLabel={translations.newestFirst ?? "Newest first"}
                oldestLabel={translations.oldestFirst ?? "Oldest first"}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="px-xs">
            <div className="h-px bg-stroke-soft" />
          </div>

          {/* Technologies section */}
          {technologies.length > 0 && (
            <>
              <div className="px-xs pb-3xs pt-2xs">
                <h3 className="pt-2xs text-base font-semibold leading-[1.45] text-text-primary">
                  {translations.technologies ?? "Technologies"}
                </h3>
              </div>
              <div className="px-xs pb-xs">
                <div className="flex flex-wrap gap-1">
                  {technologies.map((tech) => (
                    <FilterPill
                      key={tech._id}
                      label={tech.title ?? ""}
                      isSelected={localTechnologies.includes(tech._id)}
                      onClick={() => toggleTechnology(tech._id)}
                    />
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="px-xs">
                <div className="h-px bg-stroke-soft" />
              </div>
            </>
          )}

          {/* Industries section */}
          {industries.length > 0 && (
            <>
              <div className="px-xs pb-3xs pt-2xs">
                <h3 className="pt-2xs text-base font-semibold leading-[1.45] text-text-primary">
                  {translations.industries ?? "Industries"}
                </h3>
              </div>
              <div className="px-xs pb-xs">
                <div className="flex flex-wrap gap-1">
                  {industries.map((industry) => (
                    <FilterPill
                      key={industry._id}
                      label={industry.title ?? ""}
                      isSelected={localIndustries.includes(industry._id)}
                      onClick={() => toggleIndustry(industry._id)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with buttons - sticky */}
        <div className="border-t border-stroke-soft bg-container-secondary p-xs">
          <div className="flex gap-2xs">
            <Button onClick={handleApply}>{translations.applyFilters ?? "Apply filters"}</Button>
            <Button variant="secondary" onClick={handleClearAll}>
              {translations.clearAll ?? "Clear all"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilterPill({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-3xs text-body-small leading-[1.45] transition-colors",
        isSelected
          ? "bg-container-brand-1 text-text-white-primary"
          : "bg-container-primary text-text-primary hover:bg-container-shade",
      )}
    >
      {label}
    </button>
  );
}

function SortDropdown({
  value,
  onChange,
  newestLabel,
  oldestLabel,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
  newestLabel: string;
  oldestLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center gap-3xs rounded bg-container-primary pl-xs pr-2xs text-body-small leading-[1.45] text-text-primary"
      >
        <span>{value === "newest" ? newestLabel : oldestLabel}</span>
        <Icon name="chevron-down" size="sm" className={cn(isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close dropdown"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute left-0 top-full z-20 mt-1 overflow-hidden rounded bg-container-primary shadow-lg">
            <button
              type="button"
              onClick={() => handleSelect("newest")}
              className={cn(
                "flex w-full items-center gap-2xs px-xs py-2xs text-body-small leading-[1.45] text-text-primary hover:bg-container-shade",
                value === "newest" && "font-semibold",
              )}
            >
              {newestLabel}
            </button>
            <button
              type="button"
              onClick={() => handleSelect("oldest")}
              className={cn(
                "flex w-full items-center gap-2xs px-xs py-2xs text-body-small leading-[1.45] text-text-primary hover:bg-container-shade",
                value === "oldest" && "font-semibold",
              )}
            >
              {oldestLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
