import { CallToActionBlock } from "../blocks/call-to-action.block.component";
import { CardsBlock } from "../blocks/cards.block.component";
import { ContentBlock } from "../blocks/content.block.component";
import { ImageAndTextBlock } from "../blocks/image-and-text.block.component";
import { ImagesAndTextBlock } from "../blocks/images-and-text.block.component";
import { ImagesWithBannerBlock } from "../blocks/images-with-banner.block.component";
import type { PageBuilderType, PageBuilderTypeRenderMap } from "./page-builder.types";

type PageBuilderProps = {
  pageBuilder: PageBuilderType;
};

const pageBuilderBlocks: PageBuilderTypeRenderMap = {
  "callToAction.block": CallToActionBlock,
  "imageAndText.block": ImageAndTextBlock,
  "imagesAndText.block": ImagesAndTextBlock,
  "content.block": ContentBlock,
  "cards.block": CardsBlock,
  "imagesWithBanner.block": ImagesWithBannerBlock,
};

export const PageBuilder = (props: PageBuilderProps) => {
  const { pageBuilder } = props;

  if (!pageBuilder || pageBuilder.length === 0) return null;

  return pageBuilder.map((block) => {
    const { _type, _key } = block;

    const Component = pageBuilderBlocks[_type];

    if (!Component) {
      return <pre key={_key}>missing block {_type}</pre>;
    }

    // @ts-expect-error - we know the type
    return <Component key={_key} {...block} />;
  });
};
