import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { KnowledgeArticleQueryResult } from "@/sanity-types";

type Props = NonNullable<KnowledgeArticleQueryResult>;

export function KnowledgeArticle({ title, publishDate, author, summary, content }: Props) {
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("no-NO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      {/* Hero section */}
      <section className="bg-container-primary pb-md pt-xl">
        <div className="mx-auto max-w-[2560px] px-(--margin)">
          <div className="grid gap-(--gutter) lg:grid-cols-2">
            {/* Left column: back link + metadata on desktop */}
            <div className="flex flex-col gap-sm">
              {/* Desktop sidebar metadata */}
              <div className="mt-auto hidden flex-col gap-xs lg:flex">
                {author?.name && (
                  <div className="flex items-center gap-2xs">
                    {author.image && (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                    )}
                    <span className="text-body-title text-text-primary">{author.name}</span>
                  </div>
                )}
                {formattedDate && publishDate && (
                  <time dateTime={publishDate} className="text-body-small text-text-secondary">
                    {formattedDate}
                  </time>
                )}
              </div>
            </div>

            {/* Right column: title + summary */}
            <div className="flex max-w-[720px] flex-col gap-sm">
              {title && <h1 className="text-headline-1 text-text-primary">{title}</h1>}
              {summary && (
                <PortableText content={summary} className="text-body-large text-text-secondary" />
              )}

              {/* Mobile metadata */}
              <div className="flex items-center gap-xs text-body-small text-text-secondary lg:hidden">
                {author?.name && (
                  <div className="flex items-center gap-2xs">
                    {author.image && (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover"
                      />
                    )}
                    <span>{author.name}</span>
                  </div>
                )}
                {author?.name && formattedDate && <span className="text-text-secondary">·</span>}
                {formattedDate && publishDate && (
                  <time dateTime={publishDate}>{formattedDate}</time>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content section */}
      <div className="bg-container-primary">
        <div className="mx-auto max-w-[2560px] px-(--margin) pb-2xl pt-md">
          <div className="grid gap-(--gutter) lg:grid-cols-2">
            <div className="hidden lg:block" />
            <div className="max-w-[720px]">
              <PortableText
                content={content}
                className="text-body text-text-primary"
                options={{ topHLevel: 2 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
