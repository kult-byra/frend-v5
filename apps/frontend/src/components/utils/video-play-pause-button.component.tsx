"use client";

import { Icon } from "@/components/icon.component";
import { cn } from "@/utils/cn.util";

type VideoPlayPauseButtonProps = {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
};

export function VideoPlayPauseButton({
  isPlaying,
  onToggle,
  className,
}: VideoPlayPauseButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? "Pause video" : "Play video"}
      className={cn(
        "absolute bottom-2xs left-2xs z-50 cursor-pointer",
        "flex size-12 items-center justify-center rounded-full lg:size-8",
        "bg-container-primary text-text-primary",
        "transition-colors hover:bg-buttons-primary-fill-hover hover:text-text-white-primary",
        "focus:bg-buttons-primary-fill-hover focus:text-text-white-primary focus:outline-none",
        "active:bg-buttons-primary-fill-hover active:text-text-white-primary",
        "pointer-events-auto",
        className,
      )}
    >
      <Icon name={isPlaying ? "sm-pause" : "sm-play"} className="size-2.5" />
    </button>
  );
}
