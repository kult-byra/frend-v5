import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Img } from "@/components/utils/img.component";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import { Video } from "@/components/utils/video.component";
import type { MediaHeroData } from "@/server/queries/utils/hero.query";

type MediaHeroProps = MediaHeroData;

export const MediaHero = ({ title, media, excerpt, links }: MediaHeroProps) => {
  return (
    <section className="bg-white pb-20">
      <Container>
        <div className="flex flex-col items-center justify-center pb-10 pt-[120px]">
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
          <div className="aspect-3/2 w-full overflow-hidden rounded">
            {media.mediaType === "image" && media.image && (
              <Img
                {...media.image}
                sizes={{ md: "full", xl: "full" }}
                cover
                className="h-full w-full [&>img]:w-full"
              />
            )}

            {media.mediaType === "video" && media.videoUrl && (
              <div className="relative size-full">
                <Video url={media.videoUrl} priority />
              </div>
            )}

            {media.mediaType === "illustration" && media.illustration && (
              <div className="flex h-full items-center justify-center">
                <Illustration name={media.illustration as IllustrationName} />
              </div>
            )}
          </div>
        </Container>
      )}
    </section>
  );
};
