import { BlockContainer } from "@/components/layout/block-container.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import { Video } from "@/components/utils/video.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type ImageGalleryBlockProps = PageBuilderBlockProps<"imageGallery.block">;

export const ImageGalleryBlock = (props: ImageGalleryBlockProps) => {
  const { images } = props;

  if (!images || images.length === 0) return null;

  const colsClass =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-3";

  return (
    <BlockContainer>
      <div className={`grid gap-(--gutter) ${colsClass}`}>
        {images.map((item) => {
          const image = item.image as ImgProps | null;

          return (
            <div key={item._key} className="overflow-hidden rounded">
              {item.mediaType === "image" && image && <Img {...image} sizes={{ md: "third" }} />}
              {item.mediaType === "video" && item.videoUrl && <Video url={item.videoUrl} />}
            </div>
          );
        })}
      </div>
    </BlockContainer>
  );
};
