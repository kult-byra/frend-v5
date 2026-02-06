import { Illustration, type IllustrationName } from "@/components/illustration.component";
import type { ImageQueryProps } from "@/server/queries/utils/image.query";
import { cn } from "@/utils/cn.util";

import { Img, type ImgProps } from "./img.component";
import { Video, type VideoDisplayMode } from "./video.component";

export type AspectRatio = "3:2" | "3:4" | "1:1";

type MediaProps = {
  mediaType: "image" | "video" | "illustration";
  image?: ImageQueryProps | null;
  videoUrl?: string | null;
  /** Video display mode: "ambient" autoplays muted, "featured" starts paused with controls */
  videoDisplayMode?: VideoDisplayMode | null;
  /** Placeholder image shown while video loads */
  videoPlaceholder?: ImageQueryProps | null;
  illustration?: string | null;
  aspectRatio?: AspectRatio | null;
  className?: string;
  priority?: boolean;
  sizes?: ImgProps["sizes"];
  /** When true, caps height for 3:4 and 1:1 media (e.g. heroes). Default false. */
  constrainHeight?: boolean;
};

const aspectRatioClasses: Record<AspectRatio, string> = {
  "3:2": "aspect-[3/2]",
  "3:4": "aspect-[3/4]",
  "1:1": "aspect-square",
};

// Width classes for videos when height is constrained to 66.67cqi (3:2 height)
// For 3:4: width = 66.67cqi * (3/4) = 50cqi
// For 1:1: width = 66.67cqi * 1 = 66.67cqi
const constrainedVideoWidthClasses: Partial<Record<AspectRatio, string>> = {
  "3:4": "w-[50cqi]",
  "1:1": "w-[66.67cqi]",
};

export const Media = ({
  mediaType,
  image,
  videoUrl,
  videoDisplayMode,
  videoPlaceholder,
  illustration,
  aspectRatio = "3:2",
  className,
  priority = false,
  sizes = { md: "full" },
  constrainHeight = false,
}: MediaProps) => {
  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "overflow-hidden rounded",
          getMediaLayoutClasses({ constrainHeight, mediaType, aspectRatio }),
        )}
      >
        {mediaType === "image" && image && (
          <Img {...image} sizes={sizes} eager={priority} className="size-full object-cover" cover />
        )}
        {mediaType === "video" && videoUrl && (
          <Video
            url={videoUrl}
            displayMode={videoDisplayMode ?? "ambient"}
            priority={priority}
            placeholder={videoPlaceholder}
            className="size-full object-cover"
          />
        )}
        {mediaType === "illustration" && illustration && (
          <div className="flex size-full items-center justify-center">
            <Illustration name={illustration as IllustrationName} />
          </div>
        )}
      </div>
    </div>
  );
};

function getMediaLayoutClasses(opts: {
  constrainHeight: boolean;
  mediaType: MediaProps["mediaType"];
  aspectRatio: AspectRatio | null | undefined;
}): string {
  const { constrainHeight, mediaType, aspectRatio } = opts;
  const aspectClass = aspectRatio ? aspectRatioClasses[aspectRatio] : "";
  const needsMaxHeight =
    constrainHeight && aspectRatio !== "3:2" && (mediaType === "video" || mediaType === "image");
  const isVideo = mediaType === "video";

  if (!needsMaxHeight) {
    return cn(aspectClass, "w-full");
  }
  if (isVideo && aspectRatio) {
    return cn(aspectClass, "mx-auto max-h-[66.67cqi]", constrainedVideoWidthClasses[aspectRatio]);
  }
  return cn(aspectClass, "mx-auto w-fit max-h-[66.67cqi]");
}
