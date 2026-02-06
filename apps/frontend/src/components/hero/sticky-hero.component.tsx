import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import { Media } from "@/components/utils/media.component";
import type { StickyHeroData } from "@/server/queries/utils/hero.query";

type StickyHeroProps = StickyHeroData;

export const StickyHero = ({ title, media, excerpt, links }: StickyHeroProps) => {
  return (
    <section className="bg-white pb-20">
      <Container>
        <div className="grid grid-cols-1 gap-md pt-2xl lg:grid-cols-2 lg:gap-lg">
          {/* Media column - sticky on desktop */}
          {media && (
            <div className="lg:sticky lg:top-[60px] lg:self-start">
              <div className="aspect-3/4 overflow-hidden lg:aspect-auto lg:max-h-[calc(100vh-120px)]">
                <Media
                  constrainHeight
                  mediaType={media.mediaType ?? "image"}
                  image={media.image}
                  videoUrl={media.videoUrl}
                  videoDisplayMode={media.videoDisplayMode}
                  videoPlaceholder={media.videoPlaceholder}
                  illustration={media.illustration}
                  aspectRatio={media.aspectRatio}
                  priority
                  sizes={{ md: "half", xl: "half" }}
                  className="h-full w-full [&>div]:h-full"
                />
              </div>
            </div>
          )}

          {/* Content column - scrolls normally */}
          <div className="flex flex-col justify-center">
            {title && (
              <H1 className="text-[30px] font-semibold leading-[1.1] text-primary lg:text-[42px]">
                {title}
              </H1>
            )}
            {excerpt && (
              <div className="mt-6 text-lg text-secondary">
                <PortableText content={excerpt} />
              </div>
            )}
            {links && links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {links.map((link) => (
                  <LinkResolver key={link._key} {...link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
