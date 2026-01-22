"use client";

import Link from "next/link";
import { toPlainText } from "next-sanity";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import { cn } from "@/utils/cn.util";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type CardsBlockProps = PageBuilderBlockProps<"cards.block">;

type ServiceMedia = {
  mediaType: "image" | "illustration" | null;
  image: ImgProps | null;
  illustration: string | null;
};

type ServiceCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  excerpt?: unknown;
  media?: ServiceMedia | null;
};

type ImageCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  image?: ImgProps | null;
};

type ClientCardItem = ImageCardItem & {
  industries?: string[] | null;
  description?: string | null;
};

type CategoryFiltersProps = {
  industries: string[];
  selectedIndustry: string | null;
  onSelectIndustry: (industry: string | null) => void;
};

const CategoryFilters = ({
  industries,
  selectedIndustry,
  onSelectIndustry,
}: CategoryFiltersProps) => (
  <div className="flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() => onSelectIndustry(null)}
      className={cn(
        "rounded border px-4 py-2 text-body-small transition-colors",
        selectedIndustry === null
          ? " bg-orange text-dark-purple"
          : " bg-container-shade text-text-primary hover:bg-container-secondary",
      )}
    >
      Utvalgte
    </button>
    {industries.map((industry) => (
      <button
        key={industry}
        type="button"
        onClick={() => onSelectIndustry(industry)}
        className={cn(
          "rounded border px-4 py-2 text-body-small transition-colors",
          selectedIndustry === industry
            ? " bg-orange text-dark-purple"
            : "bg-transparent text-text-primary hover:bg-container-secondary",
        )}
      >
        {industry}
      </button>
    ))}
  </div>
);

const ServicesCards = ({ items }: { items: ServiceCardItem[] }) => (
  <div className="@container">
    <ul className="grid grid-cols-1 gap-(--gutter) @lg:grid-cols-2 @2xl:grid-cols-3">
      {items.map((item) => {
        const excerptText = item.excerpt
          ? toPlainText(item.excerpt as Parameters<typeof toPlainText>[0])
          : null;

        const media = item.media;

        const MediaContent = ({ className }: { className?: string }) => (
          <>
            {media?.mediaType === "image" && media.image && (
              <Img {...media.image} sizes={{ md: "third" }} className={className} />
            )}
            {media?.mediaType === "illustration" && media.illustration && (
              <Illustration name={media.illustration as IllustrationName} className={className} />
            )}
          </>
        );

        return (
          <li key={item._id} className="@container/card">
            <article className="group relative flex h-full flex-col rounded bg-container-secondary transition-colors hover:bg-container-tertiary-1">
              {/* Compact layout (small container) */}
              <div className="flex flex-col @sm/card:hidden">
                {/* Top row: illustration + title */}
                <div className="flex items-center gap-4 p-4">
                  <div className="size-20 shrink-0">
                    <MediaContent className="size-full object-contain" />
                  </div>
                  <h3 className="text-headline-3">
                    <Link href={`/tjenester/${item.slug}`} className="after:absolute after:inset-0">
                      {item.title}
                    </Link>
                  </h3>
                </div>
                {/* Bottom row: excerpt + arrow */}
                <div className="flex items-end gap-10 p-4 pt-0">
                  {excerptText && (
                    <p className="flex-1 text-body-small text-text-secondary">{excerptText}</p>
                  )}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-container-tertiary-1">
                    <Icon name="arrow-right" className="size-[10px] text-text-primary" />
                  </div>
                </div>
              </div>

              {/* Expanded layout (larger container) */}
              <div className="hidden @sm/card:flex @sm/card:h-full @sm/card:flex-col">
                {/* Illustration - left aligned */}
                <div className="px-4 pb-10 pt-4">
                  <div className="size-[120px]">
                    <MediaContent className="size-20 object-contain" />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex flex-1 flex-col gap-4 p-4">
                  <h3 className="text-headline-3">
                    <Link href={`/tjenester/${item.slug}`} className="after:absolute after:inset-0">
                      {item.title}
                    </Link>
                  </h3>
                  {excerptText && <p className="text-body text-text-secondary">{excerptText}</p>}
                </div>

                {/* Arrow button */}
                <div className="border-t border-stroke-soft p-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-container-brand-1 transition-colors group-hover:bg-button-primary-hover">
                    <Icon
                      name="arrow-right"
                      className="size-[10px] text-white transition-colors group-hover:text-button-primary-inverted-text"
                    />
                  </div>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  </div>
);

const NewsArticleCards = ({ items }: { items: ImageCardItem[] }) => (
  <div className="@container">
    <ul className="grid gap-6 @sm:grid-cols-2 @xl:grid-cols-3">
      {items.map((item) => (
        <li key={item._id}>
          <article className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white">
            {item.image && (
              <Img
                {...item.image}
                sizes={{ md: "half" }}
                className="aspect-video w-full object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">
                <Link href={`/aktuelt/${item.slug}`} className="after:absolute after:inset-0">
                  {item.title}
                </Link>
              </h3>
            </div>
          </article>
        </li>
      ))}
    </ul>
  </div>
);

const CaseStudyCards = ({ items }: { items: ImageCardItem[] }) => (
  <div className="@container">
    <ul className="grid gap-8 @sm:grid-cols-2">
      {items.map((item) => (
        <li key={item._id}>
          <article className="group relative overflow-hidden rounded-xl bg-gray-900">
            {item.image && (
              <Img
                {...item.image}
                sizes={{ md: "half" }}
                className="aspect-4/3 w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
              />
            )}
            <div className="absolute inset-0 flex items-end p-6">
              <h3 className="text-xl font-bold text-white">
                <Link href={`/case/${item.slug}`} className="after:absolute after:inset-0">
                  {item.title}
                </Link>
              </h3>
            </div>
          </article>
        </li>
      ))}
    </ul>
  </div>
);

const EventCards = ({ items }: { items: ImageCardItem[] }) => (
  <div className="@container">
    <ul className="grid gap-4 @sm:grid-cols-2 @xl:grid-cols-3">
      {items.map((item) => (
        <li key={item._id}>
          <article className="group relative flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
            {item.image && (
              <Img
                {...item.image}
                sizes={{ md: "third" }}
                className="h-20 w-20 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold text-gray-900">
                <Link href={`/arrangementer/${item.slug}`} className="after:absolute after:inset-0">
                  {item.title}
                </Link>
              </h3>
            </div>
          </article>
        </li>
      ))}
    </ul>
  </div>
);

type ClientCardsProps = {
  items: ClientCardItem[];
  links?: Parameters<typeof ButtonGroup>[0]["buttons"];
  heading?: string | null;
  content?: unknown;
  allIndustries?: string[] | null;
};

const ClientCards = ({
  items,
  links,
  heading,
  content,
  allIndustries: industriesFromQuery,
}: ClientCardsProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Filter out null values and sort alphabetically
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
        <div className="mb-12 flex flex-col gap-6 tablet:flex-row tablet:gap-4">
          {/* Left spacer - hidden on mobile */}
          <div className="hidden flex-1 tablet:block" />
          {/* Right content - heading, excerpt, and filters */}
          <div className="flex flex-1 flex-col gap-6">
            {heading && <H2>{heading}</H2>}
            <PortableText
              content={content as Parameters<typeof PortableText>[0]["content"]}
              className="text-body-large text-text-secondary"
            />
            {allIndustries.length > 0 && (
              <CategoryFilters
                industries={allIndustries}
                selectedIndustry={selectedIndustry}
                onSelectIndustry={setSelectedIndustry}
              />
            )}
          </div>
        </div>
      )}
      {/* Links - show if provided */}
      {links && links.length > 0 && (
        <div className="mb-8">
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
                  {item.image && (
                    <Img
                      {...item.image}
                      sizes={{ md: "third" }}
                      cover={false}
                      className="max-h-20 max-w-20 object-contain mix-blend-multiply"
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
      <ul className="hidden gap-4 desktop:grid desktop:grid-cols-4 wide:grid-cols-5">
        {filteredItems.map((item) => (
          <li
            key={item._id}
            className="group relative flex aspect-168/148 items-center justify-center rounded"
          >
            {/* Logo - visible by default, hidden on hover */}
            <div className="flex size-[100px] items-center justify-center transition-opacity group-hover:opacity-0">
              {item.image && (
                <Img
                  {...item.image}
                  sizes={{ md: "third" }}
                  cover={false}
                  className="w-full object-contain"
                />
              )}
            </div>
            <ClientCardHoverOverlay item={item} />
          </li>
        ))}
      </ul>
    </>
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
      <div className="flex size-8 items-center justify-center rounded-full bg-orange">
        <Icon name="arrow-right" className="size-[10px] text-dark-purple" />
      </div>
    </div>
  );

  if (item.slug) {
    return (
      <Link href={`/kunder/${item.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

const ClientCardHoverOverlay = ({ item }: { item: ClientCardItem }) => {
  const content = (
    <div className="flex w-full flex-col gap-4 rounded bg-container-tertiary-1 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-body-title text-text-primary">{item.title}</p>
        {item.description && (
          <p className="text-body-small text-text-primary">{item.description}</p>
        )}
        {item.industries && item.industries.length > 0 && (
          <p className="text-body-small text-text-secondary">{item.industries.join(", ")}</p>
        )}
      </div>
      <div className="flex size-8 items-center justify-center rounded-full bg-orange">
        <Icon name="arrow-right" className="size-[10px] text-dark-purple" />
      </div>
    </div>
  );

  const baseClassName =
    "absolute left-0 top-0 z-10 w-full pointer-events-none opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100";

  if (item.slug) {
    return (
      <Link href={`/kunder/${item.slug}`} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return <div className={baseClassName}>{content}</div>;
};

export const CardsBlock = (props: CardsBlockProps) => {
  const { heading, content, items, contentType } = props;
  // links, clientLinks, and allIndustries fields exist in query but types not regenerated yet
  const { links, clientLinks, allIndustries } = props as CardsBlockProps & {
    links?: Parameters<typeof ButtonGroup>[0]["buttons"];
    clientLinks?: Parameters<typeof ButtonGroup>[0]["buttons"];
    allIndustries?: string[] | null;
  };

  if (!items?.length) return null;

  const renderCards = () => {
    switch (contentType) {
      case "services":
        return <ServicesCards items={items as ServiceCardItem[]} />;
      case "newsArticle":
        return <NewsArticleCards items={items as ImageCardItem[]} />;
      case "caseStudy":
        return <CaseStudyCards items={items as ImageCardItem[]} />;
      case "event":
        return <EventCards items={items as ImageCardItem[]} />;
      case "client":
        return (
          <ClientCards
            items={items as ClientCardItem[]}
            links={clientLinks}
            heading={heading}
            content={content}
            allIndustries={allIndustries}
          />
        );
      default:
        return <div>Card type not implemented: {contentType}</div>;
    }
  };

  const hasServicesHeader = contentType === "services" && (content || links?.length);
  const hasDefaultHeader =
    contentType !== "services" && contentType !== "client" && (heading || content);

  return (
    <BlockContainer>
      {/* Services layout: content and button right-aligned (half-width) */}
      {hasServicesHeader && (
        <div className="mb-20 flex gap-4">
          <div className="hidden flex-1 tablet:block" />
          <div className="flex flex-1 flex-col gap-4 tablet:pr-10">
            {content && <PortableText content={content} className="text-body-large" />}
            {links && <ButtonGroup buttons={links} />}
          </div>
        </div>
      )}
      {/* Default layout for other content types */}
      {hasDefaultHeader && (
        <div className="mb-8">
          {heading && <H2 className="mb-4">{heading}</H2>}
          {content && <PortableText content={content} />}
        </div>
      )}
      {renderCards()}
    </BlockContainer>
  );
};
