import { NativeVideo } from "./native-video.component";
import { VimeoVideo } from "./vimeo-video.component";
import { YouTubeVideo } from "./youtube-video.component";

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

export const Video = ({ url, className, priority = false }: VideoProps) => {
  if (isYouTubeUrl(url)) {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    return <YouTubeVideo videoId={videoId} className={className} priority={priority} />;
  }

  if (isVimeoUrl(url)) {
    const videoId = getVimeoVideoId(url);
    if (!videoId) return null;
    return <VimeoVideo videoId={videoId} className={className} priority={priority} />;
  }

  if (isVideoFileUrl(url)) {
    return <NativeVideo url={url} className={className} priority={priority} />;
  }

  return null;
};
