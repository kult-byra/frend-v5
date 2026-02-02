"use client";

import { resolvePath } from "@workspace/routing/src/resolve-path";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Icon } from "@/components/icon.component";
import { Img } from "@/components/utils/img.component";
import type { SettingsQueryResult } from "@/sanity-types";
import type { ImageQueryProps } from "@/server/queries/utils/image.query";
import { cn } from "@/utils/cn.util";
import { getLinkHref } from "./link-href.util";
import type { LinkGroupProps } from "./menu.types";

// Manual type definitions for news and events data (typegen infers incorrectly from select statements)
type MenuNewsItem = {
  _id: string;
  _type: "newsArticle";
  title: string;
  slug: string;
  publishDate: string;
  image: ImageQueryProps | null;
};

type MenuEventItem = {
  _id: string;
  _type: "event";
  title: string;
  slug: string;
  startTime: string | null;
  excerpt: string | null;
  image: ImageQueryProps | null;
};

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
                  <PanelMainLink key={link._key} link={link} onClose={onClose} />
                ))}
              </div>
            )}

            {/* Secondary links - smaller text */}
            {secondaryLinks.length > 0 && (
              <div className="flex flex-col gap-sm">
                {secondaryLinks.map((link) => (
                  <PanelSecondaryLink key={link._key} link={link} onClose={onClose} />
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
    <article className="group relative mt-auto rounded-xs bg-container-overlay-tint p-xs">
      <div className="flex gap-xs">
        {/* Image - 80px width, 3:4 aspect ratio */}
        {image?.asset && (
          <div className="relative aspect-3/4 w-20 shrink-0 overflow-hidden rounded-xs">
            <Img {...image} sizes={{ md: "third" }} className="h-full w-full" cover />
          </div>
        )}

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2xs pr-sm">
            <span className="text-body-small text-text-primary">{typeLabel}</span>
            <h4 className="line-clamp-3 text-body-title text-text-primary">
              <Link href={href} onClick={onClose} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h4>
          </div>

          {/* Arrow button - bottom right */}
          <div className="flex justify-end">
            <div className="flex size-8 items-center justify-center rounded-full border border-text-primary">
              <Icon name="arrow-right" className="size-[10px] text-text-primary" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

type MainLinksArray = NonNullable<NonNullable<LinkGroupProps["links"]>["mainLinks"]>;
type PanelLinkProps = {
  link: MainLinksArray[number];
  onClose: () => void;
};

const PanelMainLink = ({ link, onClose }: PanelLinkProps) => {
  const href = getLinkHref(link);
  if (!href) return null;

  return (
    <Link
      href={href}
      onClick={onClose}
      className="text-headline-2 text-text-primary transition-colors hover:text-text-secondary"
    >
      {link.title}
    </Link>
  );
};

const PanelSecondaryLink = ({ link, onClose }: PanelLinkProps) => {
  const href = getLinkHref(link);
  if (!href) return null;

  return (
    <Link
      href={href}
      onClick={onClose}
      className="text-body-large text-text-primary transition-colors hover:text-text-secondary"
    >
      {link.title}
    </Link>
  );
};

// News and Events panel content types (using manual types due to typegen inference issues)
type NewsAndEventsContentProps = {
  latestNews: MenuNewsItem[] | null;
  upcomingEvents: MenuEventItem[] | null;
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
              <NewsCard key={item._id} item={item} onClose={onClose} locale={locale} />
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
              <EventCard key={item._id} item={item} onClose={onClose} locale={locale} />
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

// Format date for news cards (e.g., "24.9.2025")
const formatShortDate = (dateString: string | null, locale: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

// Format date for event cards with day name (e.g., "Thursday 16.10.2025")
const formatEventDate = (dateString: string | null, locale: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const dayName = date.toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", {
    weekday: "long",
  });
  const dateStr = date.toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  // Capitalize first letter
  return `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)} ${dateStr}`;
};

type NewsCardProps = {
  item: MenuNewsItem;
  onClose: () => void;
  locale: string;
};

const NewsCard = ({ item, onClose, locale }: NewsCardProps) => {
  const { title, slug, image, publishDate } = item;
  const href = resolvePath("newsArticle", { slug });

  return (
    <article className="group relative rounded-xs bg-container-overlay-tint p-xs">
      <div className="flex gap-xs">
        {/* Image - 80px width, 3:4 aspect ratio */}
        {image?.asset && (
          <div className="relative aspect-3/4 w-20 shrink-0 overflow-hidden rounded-xs">
            <Img {...image} sizes={{ md: "third" }} className="h-full w-full" cover />
          </div>
        )}

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2xs pr-sm">
            <span className="text-body-small text-text-primary">
              {formatShortDate(publishDate, locale)}
            </span>
            <h3 className="line-clamp-3 text-body-title text-text-primary">
              <Link href={href} onClick={onClose} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h3>
          </div>

          {/* Arrow button - bottom right */}
          <div className="flex justify-end">
            <div className="flex size-8 items-center justify-center rounded-full border border-text-primary">
              <Icon name="arrow-right" className="size-[10px] text-text-primary" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

type EventCardProps = {
  item: MenuEventItem;
  onClose: () => void;
  locale: string;
};

const EventCard = ({ item, onClose, locale }: EventCardProps) => {
  const { title, slug, image, startTime, excerpt } = item;
  const href = resolvePath("event", { slug });

  return (
    <article className="group relative rounded-xs bg-container-overlay-tint p-xs">
      <div className="flex gap-xs">
        {/* Image - 80px width, 3:4 aspect ratio */}
        {image?.asset && (
          <div className="relative aspect-3/4 w-20 shrink-0 overflow-hidden rounded-xs">
            <Img {...image} sizes={{ md: "third" }} className="h-full w-full" cover />
          </div>
        )}

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2xs pr-sm">
            <span className="text-body-small text-text-primary">
              {formatEventDate(startTime, locale)}
            </span>
            <h3 className="text-body-title text-text-primary">
              <Link href={href} onClick={onClose} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h3>
            {excerpt && <p className="line-clamp-2 text-body text-text-primary">{excerpt}</p>}
          </div>

          {/* Arrow button - bottom right */}
          <div className="flex justify-end">
            <div className="flex size-8 items-center justify-center rounded-full border border-text-primary">
              <Icon name="arrow-right" className="size-[10px] text-text-primary" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
