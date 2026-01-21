import { BlockContainer } from "@/components/layout/block-container.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import { Video } from "@/components/utils/video.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type ImagesAndTextBlockProps = PageBuilderBlockProps<"imagesAndText.block">;

type MediaItemProps = {
  item: NonNullable<ImagesAndTextBlockProps["images"]>[number];
};

const MediaItem = ({ item }: MediaItemProps) => {
  const image = item.image as ImgProps | null;

  return (
    <div className="aspect-3/4 w-full overflow-hidden rounded">
      {item.mediaType === "image" && image && (
        <Img {...image} sizes={{ md: "half" }} cover className="size-full [&>img]:size-full" />
      )}
      {item.mediaType === "video" && item.videoUrl && (
        <div className="relative size-full">
          <Video url={item.videoUrl} />
        </div>
      )}
    </div>
  );
};

export const ImagesAndTextBlock = (props: ImagesAndTextBlockProps) => {
  const { content, links, images } = props;

  const hasContent = content || links?.length;
  const imageCount = images?.length ?? 0;

  return (
    <BlockContainer bgColor="bg-container-tertiary-2">
      {/* Text section - right aligned on desktop */}
      {hasContent && (
        <div className="flex gap-(--gutter) pb-14 pt-4 lg:pb-20">
          <div className="hidden flex-1 lg:block" />
          <div className="flex flex-1 flex-col gap-4 lg:pr-10">
            {content && <PortableText content={content} className="text-body-large" />}
            {links && <ButtonGroup buttons={links} defaultVariant="default" />}
          </div>
        </div>
      )}

      {/* Images section */}
      {images && images.length > 0 && (
        <div
          className={`grid gap-(--gutter) pb-4 ${
            imageCount === 1
              ? "grid-cols-1"
              : imageCount === 2
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 lg:grid-cols-3"
          }`}
        >
          {images.map((item) => (
            <MediaItem key={item._key} item={item} />
          ))}
        </div>
      )}
    </BlockContainer>
  );
};
