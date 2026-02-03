import { Widget } from "@/components/hero/widget.component";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import { Media } from "@/components/utils/media.component";
import type { MediaHeroData } from "@/server/queries/utils/hero.query";

type MediaHeroProps = MediaHeroData;

export const MediaHero = ({ title, media, excerpt, links, widget }: MediaHeroProps) => {
  return (
    <section className="bg-white pb-20">
      <Container>
        <div className="flex flex-col items-center justify-center pb-10 pt-2xl">
          {title && (
            <H1 className="max-w-[720px] text-center text-[42px] font-semibold leading-[1.1] text-primary">
              {title}
            </H1>
          )}
          {excerpt && (
            <div className="mt-6 max-w-[640px] text-center text-lg text-secondary">
              <PortableText content={excerpt} />
            </div>
          )}
          {links && links.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {links.map((link) => (
                <LinkResolver key={link._key} {...link} />
              ))}
            </div>
          )}
        </div>
      </Container>

      {media && (
        <Container>
          <div className="relative">
            <div className="aspect-3/4 overflow-hidden lg:aspect-auto">
              <Media
                constrainHeight
                mediaType={media.mediaType ?? "image"}
                image={media.image}
                videoUrl={media.videoUrl}
                illustration={media.illustration}
                aspectRatio={media.aspectRatio}
                priority
                sizes={{ md: "full", xl: "full" }}
                className="h-full w-full [&>div]:h-full"
              />
            </div>
            {widget?.useWidget && (
              <div className="flex justify-end pb-xs pl-xs pt-md lg:absolute lg:inset-0 lg:items-start lg:p-xs">
                <div className="lg:sticky lg:top-4 lg:animate-in lg:slide-in-from-right-full lg:duration-300 lg:ease-out">
                  <Widget widget={widget} />
                </div>
              </div>
            )}
          </div>
        </Container>
      )}
    </section>
  );
};
