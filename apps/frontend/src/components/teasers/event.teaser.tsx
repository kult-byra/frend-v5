import { resolvePath } from "@workspace/routing/src/resolve-path";
import Link from "next/link";
import type { EventTeaserProps } from "@/server/queries/teasers/event-teaser.query";
import { Button } from "../ui/button";
import { Img } from "../utils/img.component";

type Props = {
  item: EventTeaserProps;
  typeLabel?: string | null;
  locale?: string;
  signupButtonLabel?: string;
  readMoreButtonLabel?: string;
};

function formatDate(dateString: string | null, locale: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return date.toLocaleDateString(locale === "no" ? "nb-NO" : "en-US", options);
}

function formatTime(dateString: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatTimeRange(startTime: string | null, endTime: string | null): string {
  if (!startTime) return "";
  const start = formatTime(startTime);
  const end = endTime ? formatTime(endTime) : "";
  return end ? `${start}-${end}` : start;
}

function getExcerpt(description: EventTeaserProps["description"]): string {
  if (!description || description.length === 0) return "";

  // Get first block paragraph
  const firstBlock = description[0];
  if (firstBlock && "children" in firstBlock && firstBlock.children) {
    return firstBlock.children
      .filter(
        (child) =>
          typeof child === "object" && child !== null && "_type" in child && child._type === "span",
      )
      .map((child) => ("text" in child ? child.text : ""))
      .join("");
  }

  return "";
}

export function EventTeaser({
  item,
  typeLabel,
  locale = "no",
  signupButtonLabel = "Sign up",
  readMoreButtonLabel = "Read more",
}: Props) {
  const { title, slug, image, timeAndDate, location, description } = item;
  const href = resolvePath("event", { slug });
  const excerpt = getExcerpt(description);

  return (
    <article className="size-full">
      <div className="flex flex-col gap-xs rounded-3xs bg-container-secondary p-xs lg:flex-row lg:items-start">
        {/* Image - top on mobile, right on desktop */}
        {image?.asset && (
          <div className="w-full overflow-hidden rounded-3xs lg:order-3 lg:max-h-[266px] lg:max-w-[400px] lg:flex-1">
            <Img
              {...image}
              sizes={{ md: "third" }}
              className="aspect-3/2 h-full w-full rounded-3xs"
              cover
            />
          </div>
        )}

        {/* Tag pill - below image on mobile, left column on desktop */}
        {typeLabel && (
          <div className="flex items-center lg:order-1 lg:max-w-4xl lg:flex-1">
            <span className="flex items-center justify-center rounded-full bg-container-primary px-3 py-3xs text-xs leading-[1.45] text-text-primary">
              {typeLabel}
            </span>
          </div>
        )}

        {/* Content - middle column on desktop */}
        <div className="flex flex-col gap-sm lg:order-2 lg:flex-1">
          <div className="flex max-w-[520px] flex-col gap-2xs">
            {/* Date, time, location row */}
            <div className="flex flex-wrap items-start gap-xs text-xs leading-[1.45] text-text-secondary">
              {timeAndDate?.startTime && <p>{formatDate(timeAndDate.startTime, locale)}</p>}
              {timeAndDate && <p>{formatTimeRange(timeAndDate.startTime, timeAndDate.endTime)}</p>}
              {location && <p>{location}</p>}
            </div>

            {/* Title */}
            <h3 className="text-[20px] font-semibold leading-[130%] text-text-primary">{title}</h3>

            {/* Description */}
            {excerpt && <p className="text-base leading-[1.45] text-text-primary">{excerpt}</p>}
          </div>

          {/* Buttons */}
          <div className="flex items-start gap-2xs">
            <Button variant="primary" asChild>
              <a href={`#signup-${item._id}`}>{signupButtonLabel}</a>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={href}>{readMoreButtonLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
