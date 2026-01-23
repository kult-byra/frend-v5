import { cn } from "@/utils/cn.util";

type VideoProps = {
  url: string;
  className?: string;
  /** When true, loads video eagerly without lazy loading - use for above-the-fold hero videos */
  priority?: boolean;
};

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
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}`;
};

const getVimeoEmbedUrl = (url: string): string => {
  const regExp = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
  const match = url.match(regExp);
  const videoId = match?.[1] ?? null;
  if (!videoId) return url;
  return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1`;
};

export const Video = ({ url, className, priority = false }: VideoProps) => {
  const loadingStrategy = priority ? "eager" : "lazy";

  if (isYouTubeUrl(url)) {
    return (
      <iframe
        src={getYouTubeEmbedUrl(url)}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading={loadingStrategy}
        className={cn("size-full", className)}
      />
    );
  }

  if (isVimeoUrl(url)) {
    return (
      <iframe
        src={getVimeoEmbedUrl(url)}
        title="Vimeo video player"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading={loadingStrategy}
        className={cn("size-full", className)}
      />
    );
  }

  if (isVideoFileUrl(url)) {
    return (
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        className={cn("size-full object-cover", className)}
      >
        <track kind="captions" />
      </video>
    );
  }

  return null;
};
