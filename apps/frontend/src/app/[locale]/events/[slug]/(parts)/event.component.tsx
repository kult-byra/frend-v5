import { PortableText } from "@/components/portable-text/portable-text.component";
import { StickyBottomContainer } from "@/components/sticky-bottom-container.component";
import type { Locale } from "@/i18n/routing";
import type { EventQueryResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";
import { EventHero } from "./event-hero.component";
import { EventInfoBox } from "./event-info-box.component";

type EventTranslations = {
  eventLabel: string;
  aboutEvent: string;
  practicalInfo: string;
  timeAndDate: string;
  location: string;
  eventSignUp: string;
};

type Props = NonNullable<EventQueryResult> & {
  locale: Locale;
  translations: EventTranslations;
};

export function Event(props: Props) {
  const {
    layout,
    color,
    title,
    media,
    timeAndDate,
    location,
    price,
    description,
    content,
    signupForm,
    locale,
    translations,
  } = props;

  const isSubmersive = layout === "submersive";
  const bgColor =
    isSubmersive && color === "yellow"
      ? "bg-container-overlay-secondary-3"
      : "bg-container-primary";

  return (
    <div className={bgColor}>
      {/* Hero */}
      <EventHero
        layout={layout}
        title={title}
        media={media}
        timeAndDate={timeAndDate}
        location={location}
        price={price}
        description={description}
        signupForm={signupForm}
        locale={locale}
        translations={translations}
      />

      {/* Main content */}
      <StickyBottomContainer
        stickyContent={<EventInfoBox signupForm={signupForm} title={translations.eventSignUp} />}
        position="center"
        className={cn("bg-container-primary", isSubmersive && bgColor)}
      >
        <div className="mx-auto max-w-[1920px] px-(--margin) pb-2xl pt-md">
          {/* Mobile: Show info box inline (only for submersive layout - default has it in hero) */}
          {isSubmersive && (
            <div className="mb-xl lg:hidden">
              <EventInfoBox
                signupForm={signupForm}
                title={translations.eventSignUp}
                className="w-full"
              />
            </div>
          )}

          {content && (
            <PortableText
              content={content}
              className="text-body text-text-primary"
              options={{ topHLevel: 2, layoutMode: "pageBuilder" }}
            />
          )}
        </div>
      </StickyBottomContainer>
    </div>
  );
}
