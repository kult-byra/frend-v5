"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn.util";
import { VideoPlayPauseButton } from "./video-play-pause-button.component";

type VimeoVideoProps = {
  videoId: string;
  className?: string;
  priority?: boolean;
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

export function VimeoVideo({ videoId, className, priority: _priority }: VimeoVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current || !window.Vimeo) return;

    playerRef.current = new window.Vimeo.Player(containerRef.current, {
      id: videoId,
      autoplay: true,
      muted: true,
      loop: true,
      background: true,
      controls: false,
    });

    playerRef.current.on("play", () => setIsPlaying(true));
    playerRef.current.on("pause", () => setIsPlaying(false));
    playerRef.current.on("loaded", () => {
      setIsReady(true);
      setIsPlaying(true);
    });
  }, [videoId]);

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

  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      <div
        ref={containerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-h-full min-w-full aspect-video [&>iframe]:size-full [&>iframe]:pointer-events-none"
      />
      {isReady && <VideoPlayPauseButton isPlaying={isPlaying} onToggle={handleToggle} />}
    </div>
  );
}
