"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon.component";
import type { ImageQueryProps } from "@/server/queries/utils/image.query";
import { cn } from "@/utils/cn.util";
import { Img } from "./img.component";
import type { VideoDisplayMode } from "./video.component";
import { VideoPlayPauseButton } from "./video-play-pause-button.component";

type YouTubeVideoProps = {
  videoId: string;
  className?: string;
  displayMode?: VideoDisplayMode;
  priority?: boolean;
  placeholder?: ImageQueryProps | null;
};

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement | string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  destroy: () => void;
};

export function YouTubeVideo({
  videoId,
  className,
  displayMode = "ambient",
  priority = false,
  placeholder,
}: YouTubeVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const isAmbient = displayMode === "ambient";

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return;

    // Different player options based on display mode
    const playerVars: Record<string, number | string> = isAmbient
      ? {
          autoplay: 1,
          mute: 1,
          loop: 1,
          controls: 0,
          playlist: videoId,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
        }
      : {
          autoplay: 0,
          mute: 0,
          loop: 0,
          controls: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        };

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars,
      events: {
        onReady: () => {
          setIsReady(true);
          if (isAmbient) {
            setIsPlaying(true);
          }
        },
        onStateChange: (event) => {
          const playing = event.data === window.YT.PlayerState.PLAYING;
          setIsPlaying(playing);
          if (playing) {
            setHasStarted(true);
          }
        },
      },
    });
  }, [videoId, isAmbient]);

  useEffect(() => {
    if (window.YT?.Player) {
      initPlayer();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      initPlayer();
    };

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [initPlayer]);

  const handleToggle = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleFeaturedPlay = () => {
    if (!playerRef.current) return;
    playerRef.current.playVideo();
  };

  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      {/* Placeholder image until video starts playing */}
      {placeholder && !hasStarted && (
        <div className="absolute inset-0 z-1">
          <Img
            {...placeholder}
            sizes={{ md: "full" }}
            eager={priority}
            className="size-full object-cover"
            cover
          />
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-h-full min-w-full aspect-video [&>iframe]:size-full",
          // Block pointer events until video has started (so custom play button receives clicks)
          // For ambient mode: always block. For featured mode: block until started
          (isAmbient || !hasStarted) && "[&>iframe]:pointer-events-none",
        )}
      />

      {/* Ambient mode: small play/pause button */}
      {isAmbient && isReady && (
        <VideoPlayPauseButton isPlaying={isPlaying} onToggle={handleToggle} />
      )}

      {/* Featured mode: centered play button overlay (before video starts) */}
      {!isAmbient && !hasStarted && (
        <button
          type="button"
          onClick={handleFeaturedPlay}
          aria-label="Play video"
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
        >
          <span
            className={cn(
              "flex size-[60px] items-center justify-center rounded-full",
              "bg-container-brand-2 text-text-white-primary",
              "transition-colors hover:bg-button-primary-hover",
            )}
          >
            <Icon name="sm-play" className="size-3" />
          </span>
        </button>
      )}
    </div>
  );
}
