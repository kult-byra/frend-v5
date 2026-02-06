"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon.component";
import type { ImageQueryProps } from "@/server/queries/utils/image.query";
import { cn } from "@/utils/cn.util";
import { Img } from "./img.component";
import type { VideoDisplayMode } from "./video.component";
import { VideoPlayPauseButton } from "./video-play-pause-button.component";

type VimeoVideoProps = {
  videoId: string;
  className?: string;
  displayMode?: VideoDisplayMode;
  priority?: boolean;
  placeholder?: ImageQueryProps | null;
};

type VimeoPlayer = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  getPaused: () => Promise<boolean>;
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback?: () => void) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    Vimeo?: {
      Player: new (element: HTMLElement, options: Record<string, unknown>) => VimeoPlayer;
    };
  }
}

export function VimeoVideo({
  videoId,
  className,
  displayMode = "ambient",
  priority = false,
  placeholder,
}: VimeoVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const isAmbient = displayMode === "ambient";

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current || !window.Vimeo) return;

    // Different player options based on display mode
    const playerOptions = isAmbient
      ? {
          id: videoId,
          autoplay: true,
          muted: true,
          loop: true,
          background: true,
          controls: false,
        }
      : {
          id: videoId,
          autoplay: false,
          muted: false,
          loop: false,
          background: false,
          controls: true,
        };

    playerRef.current = new window.Vimeo.Player(containerRef.current, playerOptions);

    playerRef.current.on("play", () => {
      setIsPlaying(true);
      setHasStarted(true);
    });
    playerRef.current.on("pause", () => setIsPlaying(false));
    playerRef.current.on("loaded", () => {
      setIsReady(true);
      if (isAmbient) {
        setIsPlaying(true);
      }
    });
  }, [videoId, isAmbient]);

  useEffect(() => {
    if (window.Vimeo?.Player) {
      initPlayer();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://player.vimeo.com/api/player.js"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.async = true;
      script.onload = () => initPlayer();
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener("load", initPlayer);
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [initPlayer]);

  const handleToggle = async () => {
    if (!playerRef.current) return;

    const paused = await playerRef.current.getPaused();
    if (paused) {
      await playerRef.current.play();
    } else {
      await playerRef.current.pause();
    }
  };

  const handleFeaturedPlay = async () => {
    if (!playerRef.current) return;
    await playerRef.current.play();
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
