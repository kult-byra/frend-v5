"use client";

import { resolvePath } from "@workspace/routing/src/resolve-path";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { SettingsQueryResult } from "@/sanity-types";
import type { ImageQueryProps } from "@/server/queries/utils/image.query";
import { cn } from "@/utils/cn.util";
import { getLinkHref } from "./link-href.util";
import type { LinkGroupProps } from "./menu.types";
import { MenuDocumentTeaser } from "./menu-document-teaser.component";

type NavPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  linkGroup: LinkGroupProps | undefined;
  stringTranslations: SettingsQueryResult["stringTranslations"];
};

export const NavPanel = ({ isOpen, onClose, linkGroup, stringTranslations }: NavPanelProps) => {
  const locale = useLocale();
  const mainLinks = linkGroup?.links?.mainLinks ?? [];
  const secondaryLinks = linkGroup?.links?.secondaryLinks ?? [];
  const isNewsAndEvents = linkGroup?.menuType === "newsAndEvents";

  return (
    <nav
      data-menu-panel
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden min-w-[560px] bg-light-purple laptop:block",
        isOpen ? "visible" : "invisible pointer-events-none",
      )}
      style={{
        // Extend width to cover the nav area - calculated from logo + nav buttons
        // Using CSS calc to get width of primary nav + logo area + padding
        width: "var(--nav-panel-width, 560px)",
      }}
      aria-label={linkGroup ? `${linkGroup.title}` : "Navigasjon"}
      aria-hidden={!isOpen}
      inert={!isOpen ? true : undefined}
    >
      {/* Panel content - offset by header height */}
      <div className="flex h-full flex-col justify-between px-xs pb-xs pt-[calc(52px+var(--spacing-sm))]">
        {/* Default panel content */}
        {!isNewsAndEvents && (
          <div className="flex flex-col gap-lg">
            {/* Main links - large headings */}
            {mainLinks.length > 0 && (
              <div className="flex flex-col gap-sm">
                {mainLinks.map((link) => (
                  <PanelLink key={link._key} link={link} onClose={onClose} />
                ))}
              </div>
            )}

            {/* Secondary links - smaller text */}
            {secondaryLinks.length > 0 && (
              <div className="flex flex-col gap-sm">
                {secondaryLinks.map((link) => (
                  <PanelLink key={link._key} link={link} onClose={onClose} variant="secondary" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* News and Events panel content */}
        {isNewsAndEvents && (
          <NewsAndEventsContent
            latestNews={linkGroup.latestNews}
            upcomingEvents={linkGroup.upcomingEvents}
            onClose={onClose}
            locale={locale}
            stringTranslations={stringTranslations}
          />
        )}

        {/* Highlighted document at bottom for knowledge menu */}
        {linkGroup?.menuType === "knowledge" && linkGroup.knowledgeHighlight?.document && (
          <HighlightedDocument
            document={linkGroup.knowledgeHighlight.document}
            onClose={onClose}
            stringTranslations={stringTranslations}
          />
        )}
      </div>
    </nav>
  );
};

type KnowledgeHighlightDocument = NonNullable<
  NonNullable<LinkGroupProps["knowledgeHighlight"]>["document"]
>;

type HighlightedDocumentProps = {
  document: KnowledgeHighlightDocument;
  onClose: () => void;
  stringTranslations: SettingsQueryResult["stringTranslations"];
};

// Map document _type to the corresponding label from stringTranslations
const getTypeLabel = (
  type: KnowledgeHighlightDocument["_type"],
  translations: SettingsQueryResult["stringTranslations"],
): string => {
  const labelMap: Record<KnowledgeHighlightDocument["_type"], string | null | undefined> = {
    knowledgeArticle: translations?.articlesAndInsights,
    caseStudy: translations?.labelCaseStudy,
    seminar: translations?.labelSeminar,
    eBook: translations?.labelEBook,
  };
  return labelMap[type] ?? type;
};

const HighlightedDocument = ({
  document,
  onClose,
  stringTranslations,
}: HighlightedDocumentProps) => {
  const { _type, title, slug, image } = document;
  const href = resolvePath(_type, { slug });
  const typeLabel = getTypeLabel(_type, stringTranslations);

  return (
    <div className="mt-auto">
      <MenuDocumentTeaser
        image={image}
        topTitle={typeLabel}
        title={title}
        href={href}
        onClose={onClose}
      />
    </div>
  );
};

type MainLinksArray = NonNullable<NonNullable<LinkGroupProps["links"]>["mainLinks"]>;

const PanelLink = ({
  link,
  onClose,
  variant = "primary",
}: {
  link: MainLinksArray[number];
  onClose: () => void;
  variant?: "primary" | "secondary";
}) => {
  const href = getLinkHref(link);
  if (!href) return null;

  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        "text-text-primary transition-colors hover:text-text-secondary",
        variant === "primary" ? "text-headline-2" : "text-body-large",
      )}
    >
      {link.title}
    </Link>
  );
};

// Manual types due to typegen inference issues with select statements
type MenuDocumentItem = {
  _id: string;
  title: string;
  slug: string;
  image: ImageQueryProps | null;
};

type NewsAndEventsContentProps = {
  latestNews: (MenuDocumentItem & { publishDate: string })[] | null;
  upcomingEvents:
    | (MenuDocumentItem & { startTime: string | null; excerpt: string | null })[]
    | null;
  onClose: () => void;
  locale: string;
  stringTranslations: SettingsQueryResult["stringTranslations"];
};

const NewsAndEventsContent = ({
  latestNews,
  upcomingEvents,
  onClose,
  locale,
  stringTranslations,
}: NewsAndEventsContentProps) => {
  const archiveHref = resolvePath("newsAndEventsArchive", {});

  return (
    <div className="flex flex-col gap-lg">
      {/* Latest news section */}
      {latestNews && latestNews.length > 0 && (
        <div className="flex flex-col gap-xs">
          <h2 className="text-headline-2 text-text-primary">
            {stringTranslations?.latestNews ?? "Latest news"}
          </h2>
          <div className="flex flex-col gap-2xs">
            {latestNews.map((item) => (
              <MenuDocumentTeaser
                key={item._id}
                image={item.image}
                topTitle={formatDate(item.publishDate, locale)}
                title={item.title}
                href={resolvePath("newsArticle", { slug: item.slug })}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming events section */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <div className="flex flex-col gap-xs">
          <h2 className="text-headline-2 text-text-primary">
            {stringTranslations?.upcomingEvents ?? "Upcoming events"}
          </h2>
          <div className="flex flex-col gap-2xs">
            {upcomingEvents.map((item) => (
              <MenuDocumentTeaser
                key={item._id}
                image={item.image}
                topTitle={formatDate(item.startTime, locale, { weekday: true })}
                title={item.title}
                description={item.excerpt}
                href={resolvePath("event", { slug: item.slug })}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      )}

      {/* All News & Events link */}
      <Link
        href={archiveHref}
        onClick={onClose}
        className="text-body-large text-text-primary transition-colors hover:text-text-secondary"
      >
        {stringTranslations?.allNewsAndEvents ?? "All News & Events"}
      </Link>
    </div>
  );
};

// Format date with optional weekday prefix
const formatDate = (
  dateString: string | null,
  locale: string,
  options?: { weekday?: boolean },
): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const localeCode = locale === "no" ? "nb-NO" : "en-GB";

  const dateStr = date.toLocaleDateString(localeCode, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  if (!options?.weekday) return dateStr;

  const dayName = date.toLocaleDateString(localeCode, { weekday: "long" });
  return `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)} ${dateStr}`;
};
