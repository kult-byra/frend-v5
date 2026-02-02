"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import { cn } from "@/utils/cn.util";

export type ClientCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  logo?: string | null;
  industries?: string[] | null;
  description?: string | null;
};

type CategoryFiltersProps = {
  industries: string[];
  selectedIndustry: string | null;
  onSelectIndustry: (industry: string | null) => void;
  featuredLabel?: string | null;
};

const CategoryFilters = ({
  industries,
  selectedIndustry,
  onSelectIndustry,
  featuredLabel,
}: CategoryFiltersProps) => {
  const options = [
    { label: featuredLabel ?? "Utvalgte", value: null },
    ...industries.map((i) => ({ label: i, value: i })),
  ];

  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => (
        <button
          key={option.value ?? "all"}
          type="button"
          onClick={() => onSelectIndustry(option.value)}
          className={cn(
            "cursor-pointer rounded px-4 py-2 text-body-small transition-colors",
            selectedIndustry === option.value
              ? "bg-buttons-primary-fill-hover text-text-primary"
              : "bg-container-shade text-text-primary hover:bg-container-secondary",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

const ClientCardExpandedContent = ({ item }: { item: ClientCardItem }) => {
  const content = (
    <div className="flex flex-col gap-4 rounded bg-container-tertiary-1 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-body-title text-text-primary">{item.title}</p>
        {item.description && (
          <p className="text-body-small text-text-primary">{item.description}</p>
        )}
        {item.industries && item.industries.length > 0 && (
          <p className="text-body-small text-text-secondary">{item.industries.join(", ")}</p>
        )}
      </div>
      <div className="flex size-8 items-center justify-center rounded-full bg-buttons-primary-fill-hover">
        <Icon name="arrow-right" className="size-[10px] text-text-primary" />
      </div>
    </div>
  );

  if (item.slug) {
    return (
      <Link href={`/clients/${item.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

const DesktopClientCard = ({ item }: { item: ClientCardItem }) => {
  // Use container-type to enable cqi units (container query inline)
  // Width = height * (168/148) calculated via aspect-ratio on inner wrapper
  const hoverContent = (
    <div className="">
      <div className="flex flex-col h-full rounded bg-container-tertiary-1 p-4 gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg leading-tight text-text-primary">{item.title}</p>
          {item.description && <p className="text-sm text-text-primary">{item.description}</p>}
          {item.industries && item.industries.length > 0 && (
            <p className="text-xs text-text-secondary">{item.industries.join(", ")}</p>
          )}
        </div>
        <div className="flex items-center justify-center mt-auto w-8 h-8 rounded-full bg-buttons-primary-fill-hover">
          <Icon name="arrow-right" className="w-2.5 h-2.5 text-text-primary" />
        </div>
      </div>
    </div>
  );

  const hoverClass = cn(
    "pointer-events-none w-[260px] h-auto absolute left-0 top-0 z-10 opacity-0 transition-opacity group-hover/card:pointer-events-auto group-hover/card:opacity-100",
  );

  return (
    <li className="group/card relative aspect-168/148">
      {/* Default state: logo centered */}
      <div className="flex size-full items-center justify-center">
        {item.logo && (
          <Image
            src={item.logo}
            alt={item.title ?? ""}
            width={100}
            height={100}
            className="max-h-[100px] max-w-[100px] object-contain"
          />
        )}
      </div>

      {/* Hover state: both width and height grow to fit content, maintaining aspect ratio */}
      {item.slug ? (
        <Link href={`/clients/${item.slug}`} className={hoverClass}>
          {hoverContent}
        </Link>
      ) : (
        <div className={hoverClass}>{hoverContent}</div>
      )}
    </li>
  );
};

export type ClientCardsProps = {
  items: ClientCardItem[];
  links?: Parameters<typeof ButtonGroup>[0]["buttons"];
  heading?: string | null;
  content?: unknown;
  allIndustries?: string[] | null;
  featuredLabel?: string | null;
};

export const ClientCards = ({
  items,
  links,
  heading,
  content,
  allIndustries: industriesFromQuery,
  featuredLabel,
}: ClientCardsProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const allIndustries = useMemo(() => {
    if (!industriesFromQuery) return [];
    return industriesFromQuery.filter((i): i is string => i != null).sort();
  }, [industriesFromQuery]);

  const filteredItems = useMemo(() => {
    if (!selectedIndustry) return items;
    return items.filter((item) => item.industries?.includes(selectedIndustry));
  }, [items, selectedIndustry]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const hasHeader = heading || content || allIndustries.length > 0;

  return (
    <>
      {/* Header section with right-aligned content on desktop */}
      {hasHeader && (
        <div className="mb-sm flex flex-col gap-6 tablet:flex-row tablet:gap-4">
          {/* Left spacer - hidden on mobile */}
          <div className="hidden flex-1 tablet:block" />
          {/* Right content - heading, excerpt, and filters */}
          <div className="flex flex-1 flex-col gap-md">
            <div className="flex flex-col gap-xs text-balance">
              {heading && <H2>{heading}</H2>}
              <PortableText
                content={content as Parameters<typeof PortableText>[0]["content"]}
                className=""
              />
            </div>
            {allIndustries.length > 0 && (
              <CategoryFilters
                industries={allIndustries}
                selectedIndustry={selectedIndustry}
                onSelectIndustry={setSelectedIndustry}
                featuredLabel={featuredLabel}
              />
            )}
          </div>
        </div>
      )}
      {/* Links - show if provided */}
      {links && links.length > 0 && (
        <div className="mb-6">
          <ButtonGroup buttons={links} />
        </div>
      )}
      {/* Mobile/tablet layout: accordion list (below desktop) */}
      <ul className="flex flex-col desktop:hidden">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item._id;
          return (
            <li key={item._id} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleExpand(item._id)}
                className={`flex w-full items-center justify-between bg-white px-4 py-4 ${
                  isExpanded ? "" : "border-b border-stroke-soft"
                }`}
              >
                <div className="flex size-20 shrink-0 items-center justify-center">
                  {item.logo && (
                    <Image
                      src={item.logo}
                      alt={item.title ?? ""}
                      width={80}
                      height={80}
                      className="max-h-20 max-w-20 object-contain"
                    />
                  )}
                </div>
                <div className="flex size-8 items-center justify-center">
                  <Icon
                    name={isExpanded ? "collapse" : "expand"}
                    className="size-4 text-text-primary transition-transform duration-200"
                  />
                </div>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <ClientCardExpandedContent item={item} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop layout: hover grid (desktop and up) */}
      <ul className="hidden gap-sm desktop:grid desktop:grid-cols-6">
        {filteredItems.map((item) => (
          <DesktopClientCard key={item._id} item={item} />
        ))}
      </ul>
    </>
  );
};
