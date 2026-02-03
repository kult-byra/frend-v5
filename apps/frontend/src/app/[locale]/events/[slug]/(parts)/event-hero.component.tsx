import { Icon } from "@/components/icon.component";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Media } from "@/components/utils/media.component";
import type { EventQueryResult } from "@/sanity-types";

type EventData = NonNullable<EventQueryResult>;
type ArticleHero = NonNullable<NonNullable<EventData["hero"]>["articleHero"]>;
type MediaData = ArticleHero["media"];

type EventHeroProps = {
  layout: EventData["layout"];
  hero: EventData["hero"];
  timeAndDate: EventData["timeAndDate"];
  location: EventData["location"];
  price: EventData["price"];
  description: EventData["description"];
};

export function EventHero({
  layout,
  hero,
  timeAndDate,
  location,
  price,
  description,
}: EventHeroProps) {
  const isSubmersive = layout === "submersive";
  const articleHero = hero?.articleHero;
  const title = articleHero?.title;
  const media = articleHero?.media;

  if (isSubmersive) {
    return <SubmersiveHero title={title} media={media} timeAndDate={timeAndDate} />;
  }

  return (
    <DefaultHero
      title={title}
      media={media}
      description={description}
      timeAndDate={timeAndDate}
      location={location}
      price={price}
    />
  );
}

type DefaultHeroProps = {
  title: string | null | undefined;
  media: MediaData | null | undefined;
  description: EventData["description"];
  timeAndDate: EventData["timeAndDate"];
  location: EventData["location"];
  price: EventData["price"];
};

function DefaultHero({
  title,
  media,
  description,
  timeAndDate,
  location,
  price,
}: DefaultHeroProps) {
  return (
    <section className="bg-container-primary pb-xl pt-xl">
      <Container>
        <div className="grid gap-xs lg:grid-cols-2">
          {/* Left: Image with top padding */}
          <div className="flex flex-col justify-center pt-2xl lg:px-[119px]">
            {media && (
              <Media
                constrainHeight
                mediaType={media.mediaType ?? "image"}
                image={media.image}
                videoUrl={media.videoUrl}
                illustration={media.illustration}
                aspectRatio="3:2"
                sizes={{ md: "half", xl: "half" }}
              />
            )}
          </div>

          {/* Right: Title + Summary */}
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-sm">
              <div className="flex flex-col gap-2xs">
                <span className="text-lg text-secondary">Event</span>
                {title && (
                  <H1 className="text-[42px] font-semibold leading-[1.1] text-primary">{title}</H1>
                )}
              </div>
            </div>

            {/* Green Summary Box */}
            <div className="flex max-w-[720px] flex-col gap-xs rounded bg-container-tertiary-3 p-xs">
              {description && description.length > 0 && (
                <div className="flex flex-col gap-2xs pr-md">
                  <p className="font-semibold text-primary">About the event</p>
                  <div className="text-lg leading-[1.5] text-primary">
                    {/* biome-ignore lint/suspicious/noExplicitAny: description uses simpler portable text type */}
                    <PortableText content={description as any} />
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2xs">
                <p className="font-semibold text-primary">Practical info</p>
                <ul className="flex flex-col gap-3xs">
                  {timeAndDate?.startTime && (
                    <li className="flex items-start gap-2xs">
                      <span className="flex items-center py-2xs">
                        <Icon name="sm-arrow-right" className="size-[10px]" />
                      </span>
                      <span className="pt-[2px] text-primary">
                        Time and date: {formatEventDateTime(timeAndDate)}
                      </span>
                    </li>
                  )}
                  {location && (
                    <li className="flex items-start gap-2xs">
                      <span className="flex items-center py-2xs">
                        <Icon name="sm-arrow-right" className="size-[10px]" />
                      </span>
                      <span className="pt-[2px] text-primary">Location: {location}</span>
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
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

type SubmersiveHeroProps = {
  title: string | null | undefined;
  media: MediaData | null | undefined;
  timeAndDate: EventData["timeAndDate"];
};

function SubmersiveHero({ title, media, timeAndDate }: SubmersiveHeroProps) {
  const dateLabel = timeAndDate?.startTime
    ? new Date(timeAndDate.startTime).toLocaleDateString("en-US", {
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
                Event{dateLabel ? `, ${dateLabel}` : ""}
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

function formatEventDateTime(timeAndDate: NonNullable<EventData["timeAndDate"]>): string {
  const { startTime, endTime } = timeAndDate;

  if (!startTime) return "";

  const start = new Date(startTime);
  const dateStr = start.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const startTimeStr = start.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (endTime) {
    const end = new Date(endTime);
    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
  }

  return `${dateStr}, ${startTimeStr}`;
}
