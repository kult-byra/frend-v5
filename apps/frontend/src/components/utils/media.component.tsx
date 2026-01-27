import { cn } from "@/utils/cn.util";
import { Img, type ImgProps } from "./img.component";
import { Video } from "./video.component";

export type AspectRatio = "3:2" | "3:4" | "1:1";

type MediaProps = {
  mediaType: "image" | "video";
  image?: ImgProps | null;
  videoUrl?: string | null;
  aspectRatio?: AspectRatio | null;
  className?: string;
  /** When true, loads media eagerly - use for above-the-fold content */
  priority?: boolean;
  /** Image sizes configuration - passed to Img component */
  sizes?: ImgProps["sizes"];
};

const aspectRatioClasses: Record<AspectRatio, string> = {
  "3:2": "aspect-[3/2]",
  "3:4": "aspect-[3/4]",
  "1:1": "aspect-square",
};

export const Media = ({
  mediaType,
  image,
  videoUrl,
  aspectRatio = "3:2",
  className,
  priority = false,
  sizes = { md: "full" },
}: MediaProps) => {
  const aspectClass = aspectRatio ? aspectRatioClasses[aspectRatio] : "";

  return (
    <div className={cn("overflow-hidden", aspectClass, className)}>
      {mediaType === "image" && image && (
        <Img {...image} sizes={sizes} eager={priority} className="size-full object-cover" />
      )}
      {mediaType === "video" && videoUrl && (
        <Video url={videoUrl} priority={priority} className="size-full object-cover" />
      )}
    </div>
  );
};
