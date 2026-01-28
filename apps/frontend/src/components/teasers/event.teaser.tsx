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
    <article className="flex size-full items-start gap-xs rounded-3xs bg-container-secondary p-xs">
      {/* Left column: Type label */}
      <div className="flex max-w-[240px] flex-1 flex-col items-start gap-xs self-stretch">
        {typeLabel && (
          <div className="flex items-center gap-xs">
            <span className="flex items-center justify-center rounded-full bg-container-primary px-3 py-3xs text-xs leading-[1.45] text-text-primary">
              {typeLabel}
            </span>
          </div>
        )}
      </div>

      {/* Middle column: Content */}
      <div className="flex flex-1 flex-col gap-sm">
        {/* Date, time, location row */}
        <div className="flex max-w-[520px] flex-col gap-2xs">
          <div className="flex items-start gap-xs text-xs leading-[1.45] text-text-secondary">
            {timeAndDate?.startTime && <p>{formatDate(timeAndDate.startTime, locale)}</p>}
            {timeAndDate && <p>{formatTimeRange(timeAndDate.startTime, timeAndDate.endTime)}</p>}
            {location && <p>{location}</p>}
          </div>

          {/* Title */}
          <h3 className="w-full text-[20px] font-semibold leading-[130%] text-text-primary">
            {title}
          </h3>

          {/* Description */}
          {excerpt && (
            <p className="w-full text-base leading-[1.45] text-text-primary">{excerpt}</p>
          )}
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

      {/* Right column: Image */}
      {image?.asset && (
        <div className="max-h-[266px] max-w-[400px] flex-1 rounded-3xs">
          <Img
            {...image}
            sizes={{ md: "third" }}
            className="aspect-3/2 h-full w-full rounded-3xs"
            cover
          />
        </div>
      )}
    </article>
  );
}
