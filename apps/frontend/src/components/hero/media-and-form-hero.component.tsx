import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { Img } from "@/components/utils/img.component";
import { Video } from "@/components/utils/video.component";
import type { MediaAndFormHeroQueryProps } from "@/server/queries/utils/hero.query";

export const MediaAndFormHero = (props: MediaAndFormHeroQueryProps) => {
  const { heroText, media } = props;

  return (
    <section className="bg-white pb-20">
      {/* Hero Text */}
      <Container>
        <div className="flex flex-col items-center justify-center pb-20 pt-[120px]">
          {heroText && (
            <H1 className="max-w-[720px] text-center text-[42px] font-semibold leading-[1.1] text-[#0b0426]">
              {heroText}
            </H1>
          )}
        </div>
      </Container>

      {/* Media */}
      <Container>
        <div className="aspect-3/2 w-full overflow-hidden rounded">
          {media?.mediaType === "image" && media.image && (
            <Img
              {...media.image}
              sizes={{ md: "full", xl: "full" }}
              cover
              className="h-full w-full [&>img]:w-full"
            />
          )}

          {media?.mediaType === "video" && media.videoUrl && (
            <div className="relative size-full">
              <Video url={media.videoUrl} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
