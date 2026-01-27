import { BlockContainer } from "@/components/layout/block-container.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import { Video } from "@/components/utils/video.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type ImageCarouselBlockProps = PageBuilderBlockProps<"imageCarousel.block">;

export const ImageCarouselBlock = (props: ImageCarouselBlockProps) => {
  const { images } = props;

  if (!images || images.length === 0) return null;

  return (
    <BlockContainer>
      {/* TODO: Replace with proper carousel component */}
      <div className="flex gap-(--gutter) overflow-x-auto">
        {images.map((item) => {
          const image = item.image as ImgProps | null;

          return (
            <div key={item._key} className="w-full shrink-0 overflow-hidden rounded md:w-1/2">
              {item.mediaType === "image" && image && <Img {...image} sizes={{ md: "half" }} />}
              {item.mediaType === "video" && item.videoUrl && <Video url={item.videoUrl} />}
            </div>
          );
        })}
      </div>
    </BlockContainer>
  );
};
