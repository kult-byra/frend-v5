"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn.util";
import { VideoPlayPauseButton } from "./video-play-pause-button.component";

type NativeVideoProps = {
  url: string;
  className?: string;
  priority?: boolean;
};

export function NativeVideo({ url, className, priority = false }: NativeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
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

  return (
    <div className={cn("relative size-full", className)}>
      <video
        ref={videoRef}
        src={url}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        className="absolute inset-0 size-full object-cover"
      >
        <track kind="captions" />
      </video>
      <VideoPlayPauseButton isPlaying={isPlaying} onToggle={handleToggle} />
    </div>
  );
}
