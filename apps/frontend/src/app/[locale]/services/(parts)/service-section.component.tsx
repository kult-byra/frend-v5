import Link from "next/link";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { TechnologyPill } from "@/components/technology-pill.component";
import { Img } from "@/components/utils/img.component";
import type { ServicesListQueryResult } from "@/sanity-types";

type ServiceItem = ServicesListQueryResult[number];

type ServiceSectionProps = {
  id: string;
  title: string;
  slug: string;
  excerpt: ServiceItem["excerpt"] | null;
  media: ServiceItem["media"] | null;
  technologies?: ServiceItem["technologies"];
  isLast?: boolean;
};

function ServiceIllustration({ media }: { media: ServiceItem["media"] | null }) {
  if (!media) return null;

  return (
    <div className="relative flex items-center justify-center">
      {/* Colored circle background */}
      <div className="absolute size-[240px] rounded-full bg-[#FFF7EB] lg:size-[500px]" />

      {/* Illustration or image */}
      <div className="relative size-[130px] lg:size-[160px]">
        {media.mediaType === "illustration" && media.illustration && (
          <Illustration
            name={media.illustration as IllustrationName}
            className="size-full object-contain"
          />
        )}
        {media.mediaType === "image" && media.image && (
          <Img {...media.image} sizes={{ md: "third" }} className="size-full object-contain" />
        )}
      </div>
    </div>
  );
}

/**
 * ServiceSection - Mobile-only layout for individual service items.
 * Desktop layout is handled by ServicesDesktopLayout component.
 */
export function ServiceSection({
  id,
  title,
  slug,
  excerpt,
  media,
  technologies,
  isLast = false,
}: ServiceSectionProps) {
  return (
    <section id={id} className="bg-container-primary lg:hidden">
      {/* Mobile layout */}
      <div className="flex flex-col px-(--margin)">
        {/* Illustration area */}
        <div className="flex items-center justify-center py-xl">
          <ServiceIllustration media={media} />
        </div>

        {/* Content area */}
        <div className="flex flex-col gap-sm pb-md">
          <div className="flex flex-col gap-4">
            <h2 className="text-headline-2 text-text-primary">{title}</h2>
            {excerpt && (
              <PortableText
                content={excerpt}
                options={{
                  pSize: "text-body-large",
                  checklistIcon: <Icon name="checkmark" className="size-[10px]" />,
                }}
              />
            )}
          </div>

          {/* CTA Arrow */}
          <Link
            href={`/services/${slug}`}
            className="group flex size-8 items-center justify-center rounded-full bg-button-primary-hover transition-colors"
            aria-label={`Read more about ${title}`}
          >
            <Icon name="arrow-right" className="size-[10px] text-text-primary transition-colors" />
          </Link>

          {/* Technology pills */}
          {technologies && technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-md">
              {technologies.map((tech) => (
                <TechnologyPill key={tech._id} technology={tech} />
              ))}
            </div>
          )}
        </div>

        {/* Separator line (not on last item) */}
        {!isLast && <div className="h-px w-full bg-stroke-soft" />}
      </div>
    </section>
  );
}
