"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { TechnologyPills } from "@/components/technology-pill.component";
import { Img } from "@/components/utils/img.component";
import type { ServicesListQueryResult } from "@/sanity-types";

type ServiceItem = ServicesListQueryResult[number];

/**
 * Find the first visible element with the given ID.
 * Handles duplicate IDs from mobile/desktop responsive layouts.
 */
function findVisibleElement(id: string): HTMLElement | null {
  const elements = document.querySelectorAll(`#${CSS.escape(id)}`);
  for (const el of elements) {
    const style = window.getComputedStyle(el);
    if (style.display !== "none" && style.visibility !== "hidden") {
      return el as HTMLElement;
    }
  }
  return null;
}

type ServicesDesktopLayoutProps = {
  services: ServicesListQueryResult;
};

function ServiceIllustration({ media }: { media: ServiceItem["media"] | null }) {
  if (!media) return null;

  return (
    <div className="relative flex items-center justify-center">
      {/* Colored circle background */}
      <div className="absolute size-[500px] rounded-full bg-[#FFF7EB]" />

      {/* Illustration or image */}
      <div className="relative size-[160px]">
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

export function ServicesDesktopLayout({ services }: ServicesDesktopLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Track which section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (let i = 0; i < services.length; i++) {
      const element = findVisibleElement(`service-${i}`);
      if (!element) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveIndex(i);
            }
          }
        },
        {
          rootMargin: "-40% 0px -40% 0px",
          threshold: 0,
        },
      );

      observer.observe(element);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, [services]);

  const activeService = services[activeIndex];

  return (
    <div className="hidden px-(--margin) lg:flex lg:gap-(--gutter)">
      {/* Left column - single sticky illustration that updates based on active section */}
      <div className="flex-1">
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <ServiceIllustration media={activeService?.media ?? null} />
        </div>
      </div>

      {/* Right column - all content sections */}
      <div className="flex flex-1 flex-col">
        {services.map((service, index) => (
          <div
            key={service._id}
            id={`service-${index}`}
            className="flex min-h-screen flex-col justify-center gap-md pb-xl pr-md"
          >
            <div className="flex flex-col gap-xs">
              <h2 className="max-w-[540px] text-headline-2 text-text-primary">{service.title}</h2>
              {service.excerpt && (
                <div className="max-w-[540px]">
                  <PortableText
                    content={service.excerpt}
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
              href={`/services/${service.slug}`}
              className="group flex size-8 items-center justify-center rounded-full bg-button-primary-hover transition-colors hover:bg-container-brand-1"
              aria-label={`Read more about ${service.title}`}
            >
              <Icon
                name="arrow-right"
                className="size-[10px] text-text-primary transition-colors group-hover:text-white"
              />
            </Link>

            {/* Technology pills */}
            {service.technologies && service.technologies.length > 0 && (
              <TechnologyPills technologies={service.technologies} className="flex-wrap pt-md" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
