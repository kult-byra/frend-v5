import type { _pageBuilderTypegenQueryResult } from "@/sanity-types";
import { CallToActionBlock } from "../blocks/call-to-action.block.component";
import { ImageAndTextBlock } from "../blocks/image-and-text.block.component";
import type { PageBuilderTypeRenderMap } from "./page-builder.types";

type PageBuilderProps = {
  pageBuilder: NonNullable<_pageBuilderTypegenQueryResult>;
};

const pageBuilderBlocks: PageBuilderTypeRenderMap = {
  "callToAction.block": CallToActionBlock,
  "imageAndText.block": ImageAndTextBlock,
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
