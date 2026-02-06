"use client";

import { useState } from "react";
import { SanityImage } from "sanity-image";
import { Icon } from "@/components/icon.component";
import { Container } from "@/components/layout/container.component";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { Link } from "@/components/utils/link.component";
import { env } from "@/env";
import type { DetailedAuthor } from "@/server/queries/utils/detailed-author.query";
import { cn } from "@/utils/cn.util";

type DetailedBylineCardProps = {
  author: DetailedAuthor;
  showMoreLabel: string;
  showLessLabel: string;
};

function DetailedBylineCard({ author, showMoreLabel, showLessLabel }: DetailedBylineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const authorUrl = author.slug ? `/people/${author.slug}` : null;

  const hasExpandableContent =
    author.excerpt ||
    author.email ||
    author.phone ||
    (author.profileLinks && author.profileLinks.length > 0);

  return (
    <div className="rounded bg-container-tertiary-2 p-xs">
      <div className="flex max-w-[720px] flex-col gap-xs">
        {/* Header: avatar + name/role */}
        <div className="flex items-center gap-xs">
          {/* Avatar */}
          {author.image?.asset?._id && (
            <SanityImage
              id={author.image.asset._id}
              projectId={env.NEXT_PUBLIC_SANITY_PROJECT_ID}
              dataset={env.NEXT_PUBLIC_SANITY_DATASET}
              alt={author.name ?? ""}
              width={82}
              height={82}
              crop={author.image.crop ?? undefined}
              hotspot={author.image.hotspot ?? undefined}
              className="size-[82px] shrink-0 rounded-full object-cover"
            />
          )}

          {/* Name + role */}
          <div className="flex flex-1 flex-col gap-3xs">
            {author.name &&
              (authorUrl ? (
                <Link
                  href={authorUrl}
                  className="w-fit border-b border-stroke-soft text-base font-semibold leading-[145%] text-text-primary hover:text-button-secondary-text-hover"
                >
                  {author.name}
                </Link>
              ) : (
                <span className="text-base font-semibold leading-[145%] text-text-primary">
                  {author.name}
                </span>
              ))}
            {author.role && (
              <span className="text-base leading-[145%] text-text-secondary">{author.role}</span>
            )}
          </div>
        </div>

        {/* Show more toggle (below header) */}
        {hasExpandableContent && !isExpanded && (
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="border-b border-stroke-soft text-base leading-[145%] text-text-primary"
            >
              {showMoreLabel}
            </button>
          </div>
        )}

        {/* Expandable content */}
        {hasExpandableContent && (
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-out",
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-xs">
                {/* Excerpt / bio */}
                {author.excerpt && (
                  <>
                    <div className="h-px w-full rounded-sm bg-stroke-soft" />
                    <p className="text-base leading-[145%] text-text-primary">{author.excerpt}</p>
                  </>
                )}

                {/* Contact info + profile links */}
                {(author.email ||
                  author.phone ||
                  (author.profileLinks && author.profileLinks.length > 0)) && (
                  <>
                    <div className="h-px w-full rounded-sm bg-stroke-soft" />
                    <div className="grid grid-cols-1 gap-2xs sm:grid-cols-2">
                      {/* Left column: phone + email */}
                      {(author.phone || author.email) && (
                        <div className="flex flex-col gap-2xs">
                          {author.phone && (
                            <a
                              href={`tel:${author.phone.replace(/\s/g, "")}`}
                              className="w-fit border-b border-stroke-soft text-base leading-[145%] text-text-primary"
                            >
                              {author.phone}
                            </a>
                          )}
                          {author.email && (
                            <a
                              href={`mailto:${author.email}`}
                              className="w-fit border-b border-stroke-soft text-base leading-[145%] text-text-primary"
                            >
                              {author.email}
                            </a>
                          )}
                        </div>
                      )}

                      {/* Right column: profile links */}
                      {author.profileLinks && author.profileLinks.length > 0 && (
                        <div className="flex flex-col gap-2xs">
                          {author.profileLinks.map((link) => (
                            <a
                              key={link._key}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex w-fit items-center gap-3xs border-b border-stroke-soft text-base leading-[145%] text-text-primary"
                            >
                              {link.title}
                              <Icon name="sm-arrow-top-right" size="xs" className="pt-0.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Collapse toggle */}
                <div className="h-px w-full rounded-sm bg-stroke-soft" />
                <div className="flex w-full justify-end">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="border-b border-stroke-soft text-base leading-[145%] text-text-primary"
                  >
                    {showLessLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type DetailedBylineListProps = {
  authors?: DetailedAuthor[] | null;
  showMoreLabel: string;
  showLessLabel: string;
};

export function DetailedBylineList({
  authors,
  showMoreLabel,
  showLessLabel,
}: DetailedBylineListProps) {
  if (!authors || authors.length === 0) return null;

  return (
    <section className="bg-container-primary pb-xl">
      <Container>
        <ContentLayout>
          <div className="flex flex-col gap-xs">
            {authors.map((author) => (
              <DetailedBylineCard
                key={author._id}
                author={author}
                showMoreLabel={showMoreLabel}
                showLessLabel={showLessLabel}
              />
            ))}
          </div>
        </ContentLayout>
      </Container>
    </section>
  );
}
