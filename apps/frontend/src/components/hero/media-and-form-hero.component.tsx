import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { Img } from "@/components/utils/img.component";
import type { MediaAndFormHeroQueryProps } from "@/server/queries/utils/hero.query";

const isYouTubeUrl = (url: string): boolean => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
};

const isVimeoUrl = (url: string): boolean => {
  return /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/.test(url);
};

const isVideoFileUrl = (url: string): boolean => {
  return /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i.test(url);
};

const getYouTubeEmbedUrl = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match?.[2]?.length === 11 ? match[2] : null;
  if (!videoId) return url;
  // autoplay=1, mute=1, loop=1, controls=0 (no controls), playlist=videoId (required for loop)
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}`;
};

const getVimeoEmbedUrl = (url: string): string => {
  const regExp = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
  const match = url.match(regExp);
  const videoId = match ? match[1] : null;
  if (!videoId) return url;
  // autoplay=1, muted=1, loop=1, background=1 (removes controls and makes it autoplay)
  return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1`;
};

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
            <div className="relative h-full w-full">
              {isYouTubeUrl(media.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(media.videoUrl)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : isVimeoUrl(media.videoUrl) ? (
                <iframe
                  src={getVimeoEmbedUrl(media.videoUrl)}
                  title="Vimeo video player"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : isVideoFileUrl(media.videoUrl) ? (
                <video
                  src={media.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <track kind="captions" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <p className="text-sm text-gray-500">Invalid video URL: {media.videoUrl}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
