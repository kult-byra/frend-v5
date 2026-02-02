import { SanityImage } from "sanity-image";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Img } from "@/components/utils/img.component";
import { Video } from "@/components/utils/video.component";
import { env } from "@/env";
import type { ArticleHeroData } from "@/server/queries/utils/hero.query";

type ArticleHeroProps = ArticleHeroData;

export const ArticleHero = ({
  title,
  coverImages,
  author,
  publishDate,
  excerpt,
}: ArticleHeroProps) => {
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("nb-NO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <section className="bg-white pb-20">
      <Container>
        <div className="flex flex-col items-center justify-center pb-10 pt-[120px]">
          {title && (
            <H1 className="max-w-[720px] text-center text-[42px] font-semibold leading-[1.1] text-primary">
              {title}
            </H1>
          )}

          {(author || formattedDate) && (
            <div className="mt-6 flex items-center gap-4">
              {author?.image?.asset?._id && (
                <SanityImage
                  id={author.image.asset._id}
                  projectId={env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                  dataset={env.NEXT_PUBLIC_SANITY_DATASET}
                  alt={author.name ?? ""}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
              )}
              <div className="flex flex-col">
                {author?.name && (
                  <span className="text-sm font-medium text-primary">{author.name}</span>
                )}
                {formattedDate && <span className="text-sm text-secondary">{formattedDate}</span>}
              </div>
            </div>
          )}

          {excerpt && (
            <div className="mt-6 max-w-[640px] text-center text-lg text-secondary">
              <PortableText content={excerpt} />
            </div>
          )}
        </div>
      </Container>

      {coverImages && coverImages.length > 0 && (
        <Container>
          <div
            className={`grid gap-4 ${
              coverImages.length === 1
                ? "grid-cols-1"
                : coverImages.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {coverImages.map((coverImage, index) => (
              <div
                key={coverImage.image?.asset?._id ?? index}
                className={`aspect-3/2 overflow-hidden rounded ${
                  coverImages.length === 1 ? "col-span-full" : ""
                }`}
              >
                {coverImage.mediaType === "image" && coverImage.image && (
                  <Img
                    {...coverImage.image}
                    sizes={
                      coverImages.length === 1
                        ? { md: "full", xl: "full" }
                        : { md: "half", xl: "third" }
                    }
                    cover
                    className="h-full w-full [&>img]:w-full"
                  />
                )}
                {coverImage.mediaType === "video" && coverImage.videoUrl && (
                  <div className="relative size-full">
                    <Video url={coverImage.videoUrl} priority />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      )}
    </section>
  );
};
