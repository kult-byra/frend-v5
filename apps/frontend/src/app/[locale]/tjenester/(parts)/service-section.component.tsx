import Link from "next/link";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Img } from "@/components/utils/img.component";
import type { ServicesListQueryResult } from "@/sanity-types";

type ServiceItem = ServicesListQueryResult[number];

type ServiceSectionProps = {
  id: string;
  title: string;
  slug: string;
  excerpt: ServiceItem["excerpt"] | null;
  media: ServiceItem["media"] | null;
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

export function ServiceSection({
  id,
  title,
  slug,
  excerpt,
  media,
  isLast = false,
}: ServiceSectionProps) {
  return (
    <section id={id} className="bg-container-primary">
      {/* Mobile layout */}
      <div className="flex flex-col px-(--margin) lg:hidden">
        {/* Illustration area */}
        <div className="flex items-center justify-center py-(--spacing-xl)">
          <ServiceIllustration media={media} />
        </div>

        {/* Content area */}
        <div className="flex flex-col gap-(--spacing-sm) pb-(--spacing-md)">
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
            href={`/tjenester/${slug}`}
            className="group flex size-8 items-center justify-center rounded-full bg-button-primary-hover transition-colors"
            aria-label={`Read more about ${title}`}
          >
            <Icon
              name="arrow-right"
              className="size-[10px] text-text-primary transition-colors"
            />
          </Link>
        </div>

        {/* Separator line (not on last item) */}
        {!isLast && <div className="h-px w-full bg-stroke-soft" />}
      </div>

      {/* Desktop layout */}
      <div className="hidden gap-(--gutter) px-(--margin) lg:grid lg:grid-cols-2">
        {/* Left column - sticky illustration */}
        <div className="relative h-[830px]">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <ServiceIllustration media={media} />
          </div>
        </div>

        {/* Right column - scrollable content */}
        <div className="flex flex-col gap-(--spacing-md) pb-(--spacing-xl) pl-0 pr-(--spacing-md) pt-[160px]">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-[540px] text-headline-2 text-text-primary">{title}</h2>
            {excerpt && (
              <div className="max-w-[540px]">
                <PortableText
                  content={excerpt}
                  options={{
                    pSize: "text-body-large",
                    checklistIcon: <Icon name="checkmark" className="size-[10px]" />,
                  }}
                />
              </div>
            )}
          </div>

          {/* CTA Arrow */}
          <Link
            href={`/tjenester/${slug}`}
            className="group flex size-8 items-center justify-center rounded-full bg-button-primary-hover transition-colors"
            aria-label={`Read more about ${title}`}
          >
            <Icon
              name="arrow-right"
              className="size-[10px] text-text-primary transition-colors"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
