import type { ImageQueryProps } from "@/server/queries/utils/image.query";

import { NativeVideo } from "./native-video.component";
import { VimeoVideo } from "./vimeo-video.component";
import { YouTubeVideo } from "./youtube-video.component";

/** Video display mode: "ambient" autoplays muted in loop, "featured" starts paused with full controls */
export type VideoDisplayMode = "ambient" | "featured";

export type VideoProps = {
  url: string;
  className?: string;
  /** Display mode: "ambient" autoplays muted, "featured" starts paused with controls */
  displayMode?: VideoDisplayMode;
  /** When true, loads video eagerly without lazy loading - use for above-the-fold hero videos */
  priority?: boolean;
  /** Placeholder image shown while video loads */
  placeholder?: ImageQueryProps | null;
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

const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match?.[2]?.length === 11 ? match[2] : null;
};

const getVimeoVideoId = (url: string): string | null => {
  const regExp = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
  const match = url.match(regExp);
  return match?.[1] ?? null;
};

export const Video = ({
  url,
  className,
  displayMode = "ambient",
  priority = false,
  placeholder,
}: VideoProps) => {
  if (isYouTubeUrl(url)) {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    return (
      <YouTubeVideo
        videoId={videoId}
        className={className}
        displayMode={displayMode}
        priority={priority}
        placeholder={placeholder}
      />
    );
  }

  if (isVimeoUrl(url)) {
    const videoId = getVimeoVideoId(url);
    if (!videoId) return null;
    return (
      <VimeoVideo
        videoId={videoId}
        className={className}
        displayMode={displayMode}
        priority={priority}
        placeholder={placeholder}
      />
    );
  }

  if (isVideoFileUrl(url)) {
    return (
      <NativeVideo
        url={url}
        className={className}
        displayMode={displayMode}
        priority={priority}
        placeholder={placeholder}
      />
    );
  }

  return null;
};
