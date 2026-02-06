"use client";

import { useState } from "react";
import { HubspotForm } from "@/components/hubspot/hubspot-form.component";
import { Icon } from "@/components/icon.component";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Media } from "@/components/utils/media.component";
import type { Locale } from "@/i18n/routing";
import type { EventQueryResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";

type EventData = NonNullable<EventQueryResult>;
type MediaData = EventData["media"];

type SignupForm = {
  _id: string;
  title: string | null;
  formId: string | null;
} | null;

type EventTranslations = {
  eventLabel: string;
  aboutEvent: string;
  practicalInfo: string;
  timeAndDate: string;
  location: string;
  eventSignUp: string;
};

type EventHeroProps = {
  layout: EventData["layout"];
  title: EventData["title"];
  media: MediaData;
  timeAndDate: EventData["timeAndDate"];
  location: EventData["location"];
  price: EventData["price"];
  description: EventData["description"];
  signupForm: SignupForm;
  locale: Locale;
  translations: EventTranslations;
};

export function EventHero({
  layout,
  title,
  media,
  timeAndDate,
  location,
  price,
  description,
  signupForm,
  locale,
  translations,
}: EventHeroProps) {
  const isSubmersive = layout === "submersive";

  if (isSubmersive) {
    return (
      <SubmersiveHero
        title={title}
        media={media}
        timeAndDate={timeAndDate}
        locale={locale}
        translations={translations}
      />
    );
  }

  return (
    <DefaultHero
      title={title}
      media={media}
      description={description}
      timeAndDate={timeAndDate}
      location={location}
      price={price}
      signupForm={signupForm}
      locale={locale}
      translations={translations}
    />
  );
}

type DefaultHeroProps = {
  title: string | null | undefined;
  media: MediaData;
  description: EventData["description"];
  timeAndDate: EventData["timeAndDate"];
  location: EventData["location"];
  price: EventData["price"];
  signupForm: SignupForm;
  locale: Locale;
  translations: EventTranslations;
};

function DefaultHero({
  title,
  media,
  description,
  timeAndDate,
  location,
  price,
  signupForm,
  locale,
  translations,
}: DefaultHeroProps) {
  const localeCode = locale === "no" ? "nb-NO" : "en-US";
  const dateLabel = timeAndDate?.startTime
    ? new Date(timeAndDate.startTime).toLocaleDateString(localeCode, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section className="bg-container-primary pb-xl pt-xl">
      <Container>
        {/* Mobile layout: label → title → image → signup → summary */}
        <div className="flex flex-col gap-md lg:hidden">
          {/* Label + Title */}
          <div className="flex flex-col gap-2xs">
            <span className="text-lg text-secondary">
              {translations.eventLabel}
              {dateLabel ? `, ${dateLabel}` : ""}
            </span>
            {title && (
              <H1 className="text-[30px] font-semibold leading-[1.1] text-primary">{title}</H1>
            )}
          </div>

          {/* Image */}
          {media && (
            <Media
              constrainHeight
              mediaType={media.mediaType ?? "image"}
              image={media.image}
              videoUrl={media.videoUrl}
              videoDisplayMode={media.videoDisplayMode}
              videoPlaceholder={media.videoPlaceholder}
              illustration={media.illustration}
              aspectRatio="3:2"
              sizes={{ md: "full" }}
            />
          )}

          {/* Signup Form */}
          {signupForm?.formId && (
            <div className="flex flex-col rounded-3xs bg-container-secondary p-xs">
              <p className="pb-2xs text-base font-semibold text-primary">
                {translations.eventSignUp}
              </p>
              <HubspotForm formId={signupForm.formId} />
            </div>
          )}

          {/* Summary as Accordions in Green Box */}
          <EventSummaryAccordions
            description={description}
            timeAndDate={timeAndDate}
            location={location}
            price={price}
            localeCode={localeCode}
            translations={translations}
          />
        </div>

        {/* Desktop layout: side by side */}
        <div className="hidden gap-xs lg:grid lg:grid-cols-2">
          {/* Left: Image with padding */}
          <div className="flex flex-col justify-center px-[119px] pt-2xl">
            {media && (
              <Media
                constrainHeight
                mediaType={media.mediaType ?? "image"}
                image={media.image}
                videoUrl={media.videoUrl}
                videoDisplayMode={media.videoDisplayMode}
                videoPlaceholder={media.videoPlaceholder}
                illustration={media.illustration}
                aspectRatio="3:2"
                sizes={{ md: "half", xl: "half" }}
              />
            )}
          </div>

          {/* Right: Title + Summary */}
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-2xs">
              <span className="text-lg text-secondary">
                {translations.eventLabel}
                {dateLabel ? `, ${dateLabel}` : ""}
              </span>
              {title && (
                <H1 className="text-[42px] font-semibold leading-[1.1] text-primary">{title}</H1>
              )}
            </div>

            {/* Green Summary Box - expanded on desktop */}
            <div className="flex max-w-[720px] flex-col gap-xs rounded bg-container-tertiary-3 p-xs">
              {description && description.length > 0 && (
                <div className="flex flex-col gap-2xs pr-md">
                  <p className="font-semibold text-primary">{translations.aboutEvent}</p>
                  <div className="text-lg leading-[1.5] text-primary">
                    {/* biome-ignore lint/suspicious/noExplicitAny: description uses simpler portable text type */}
                    <PortableText content={description as any} />
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2xs">
                <p className="font-semibold text-primary">{translations.practicalInfo}</p>
                <PracticalInfoList
                  timeAndDate={timeAndDate}
                  location={location}
                  price={price}
                  localeCode={localeCode}
                  translations={translations}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Accordion item for mobile summary */
function SummaryAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stroke-soft last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-xs py-2xs text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-primary">{title}</span>
        <Icon
          name="lg-chevron-down"
          className={cn(
            "size-3 text-primary transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-xs">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Mobile summary accordions in green box */
function EventSummaryAccordions({
  description,
  timeAndDate,
  location,
  price,
  localeCode,
  translations,
}: {
  description: EventData["description"];
  timeAndDate: EventData["timeAndDate"];
  location: EventData["location"];
  price: EventData["price"];
  localeCode: string;
  translations: EventTranslations;
}) {
  const hasDescription = description && description.length > 0;
  const hasPracticalInfo = timeAndDate?.startTime || location || price;

  if (!hasDescription && !hasPracticalInfo) return null;

  return (
    <div className="flex flex-col rounded bg-container-tertiary-3 p-xs">
      {hasDescription && (
        <SummaryAccordion title={translations.aboutEvent} defaultOpen>
          <div className="text-lg leading-[1.5] text-primary">
            {/* biome-ignore lint/suspicious/noExplicitAny: description uses simpler portable text type */}
            <PortableText content={description as any} />
          </div>
        </SummaryAccordion>
      )}
      {hasPracticalInfo && (
        <SummaryAccordion title={translations.practicalInfo} defaultOpen={!hasDescription}>
          <PracticalInfoList
            timeAndDate={timeAndDate}
            location={location}
            price={price}
            localeCode={localeCode}
            translations={translations}
          />
        </SummaryAccordion>
      )}
    </div>
  );
}

/** Reusable practical info list */
function PracticalInfoList({
  timeAndDate,
  location,
  price,
  localeCode,
  translations,
}: {
  timeAndDate: EventData["timeAndDate"];
  location: EventData["location"];
  price: EventData["price"];
  localeCode: string;
  translations: EventTranslations;
}) {
  return (
    <ul className="flex flex-col gap-3xs">
      {timeAndDate?.startTime && (
        <li className="flex items-start gap-2xs">
          <span className="flex items-center py-2xs">
            <Icon name="sm-arrow-right" className="size-[10px]" />
          </span>
          <span className="pt-[2px] text-primary">
            {translations.timeAndDate}: {formatEventDateTime(timeAndDate, localeCode)}
          </span>
        </li>
      )}
      {location && (
        <li className="flex items-start gap-2xs">
          <span className="flex items-center py-2xs">
            <Icon name="sm-arrow-right" className="size-[10px]" />
          </span>
          <span className="pt-[2px] text-primary">
            {translations.location}: {location}
          </span>
        </li>
      )}
      {price && (
        <li className="flex items-start gap-2xs">
          <span className="flex items-center py-2xs">
            <Icon name="sm-arrow-right" className="size-[10px]" />
          </span>
          <span className="pt-[2px] text-primary">{price}</span>
        </li>
      )}
    </ul>
  );
}

type SubmersiveHeroProps = {
  title: string | null | undefined;
  media: MediaData;
  timeAndDate: EventData["timeAndDate"];
  locale: Locale;
  translations: EventTranslations;
};

function SubmersiveHero({ title, media, timeAndDate, locale, translations }: SubmersiveHeroProps) {
  const localeCode = locale === "no" ? "nb-NO" : "en-US";
  const dateLabel = timeAndDate?.startTime
    ? new Date(timeAndDate.startTime).toLocaleDateString(localeCode, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section className="flex flex-col gap-md py-xl">
      <Container>
        {/* Title section - half width on desktop */}
        <div className="flex justify-end">
          <div className="w-full pr-md lg:w-1/2">
            <div className="flex max-w-[720px] flex-col gap-xs">
              <span className="text-lg text-secondary">
                {translations.eventLabel}
                {dateLabel ? `, ${dateLabel}` : ""}
              </span>
              {title && (
                <H1 className="text-[42px] font-semibold leading-[1.1] text-primary">{title}</H1>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Full width image */}
      <Container>
        {media && (
          <Media
            constrainHeight
            mediaType={media.mediaType ?? "image"}
            image={media.image}
            videoUrl={media.videoUrl}
            videoDisplayMode={media.videoDisplayMode}
            videoPlaceholder={media.videoPlaceholder}
            illustration={media.illustration}
            aspectRatio="3:2"
            sizes={{ md: "full", xl: "full" }}
            priority
          />
        )}
      </Container>
    </section>
  );
}

function formatEventDateTime(
  timeAndDate: NonNullable<EventData["timeAndDate"]>,
  localeCode: string,
): string {
  const { startTime, endTime } = timeAndDate;

  if (!startTime) return "";

  const start = new Date(startTime);
  const dateStr = start.toLocaleDateString(localeCode, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const startTimeStr = start.toLocaleTimeString(localeCode, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (endTime) {
    const end = new Date(endTime);
    const endTimeStr = end.toLocaleTimeString(localeCode, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
  }

  return `${dateStr}, ${startTimeStr}`;
}
