"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon.component";
import type { ImageQueryProps } from "@/server/queries/utils/image.query";
import { cn } from "@/utils/cn.util";
import { Img } from "./img.component";
import type { VideoDisplayMode } from "./video.component";
import { VideoPlayPauseButton } from "./video-play-pause-button.component";

type NativeVideoProps = {
  url: string;
  className?: string;
  displayMode?: VideoDisplayMode;
  priority?: boolean;
  placeholder?: ImageQueryProps | null;
};

export function NativeVideo({
  url,
  className,
  displayMode = "ambient",
  priority = false,
  placeholder,
}: NativeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setHasStarted(true);
    };
    const handlePause = () => setIsPlaying(false);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleFeaturedPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play();
  };

  const isAmbient = displayMode === "ambient";

  return (
    <div className={cn("relative size-full", className)}>
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

      <video
        ref={videoRef}
        src={url}
        autoPlay={isAmbient}
        muted={isAmbient}
        loop={isAmbient}
        controls={!isAmbient && hasStarted}
        playsInline
        preload={priority ? "auto" : "metadata"}
        className="absolute inset-0 size-full object-cover"
      >
        <track kind="captions" />
      </video>

      {/* Ambient mode: small play/pause button */}
      {isAmbient && <VideoPlayPauseButton isPlaying={isPlaying} onToggle={handleToggle} />}

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
