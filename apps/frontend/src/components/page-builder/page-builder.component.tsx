import { cn } from "@/utils/cn.util";
import { CallToActionBlock } from "../blocks/call-to-action.block.component";
import { CardsBlock } from "../blocks/cards.block.component";
import { ContentBlock } from "../blocks/content.block.component";
import { ImageAndTextBlock } from "../blocks/image-and-text.block.component";
import { ImageCarouselBlock } from "../blocks/image-carousel.block.component";
import { ImageGalleryBlock } from "../blocks/image-gallery.block.component";
import { ImagesAndTextBlock } from "../blocks/images-and-text.block.component";
import { ImagesWithBannerBlock } from "../blocks/images-with-banner.block.component";
import { JobOpeningsBlock } from "../blocks/job-openings.block.component";
import { LogoCloudBlock } from "../blocks/logo-cloud.block.component";
import { PeopleBlock } from "../blocks/people.block.component";
import { QuotesBlock } from "../blocks/quotes.block.component";
import type { PageBuilderType } from "./page-builder.types";

type PageBuilderProps = {
  pageBuilder: PageBuilderType;
};

// Using Record<string, any> since not all block types may be present in the generated types
// biome-ignore lint/suspicious/noExplicitAny: block components have varying props
const pageBuilderBlocks: Record<string, React.ComponentType<any>> = {
  "callToAction.block": CallToActionBlock,
  "imageAndText.block": ImageAndTextBlock,
  "imagesAndText.block": ImagesAndTextBlock,
  "content.block": ContentBlock,
  "cards.block": CardsBlock,
  "imagesWithBanner.block": ImagesWithBannerBlock,
  "quotes.block": QuotesBlock,
  "people.block": PeopleBlock,
  "logoCloud.block": LogoCloudBlock,
  "jobOpenings.block": JobOpeningsBlock,
  "imageGallery.block": ImageGalleryBlock,
  "imageCarousel.block": ImageCarouselBlock,
};

export const PageBuilder = (props: PageBuilderProps) => {
  const { pageBuilder } = props;

  if (!pageBuilder || pageBuilder.length === 0) return null;

  return pageBuilder.map((block) => {
    const { _type, _key, options } = block as {
      _type: string;
      _key: string;
      options?: { layout?: string };
    };

    const Component = pageBuilderBlocks[_type];

    if (!Component) {
      return <pre key={_key}>missing block {_type}</pre>;
    }

    const blockContent = (
      <>
        <Component key={_key} {...block} />
        <p className="text-body-small text-text-secondary font-mono">👆 {_type}</p>
      </>
    );

    // Handle different layout options
    // fullWidth breaks out of ContentLayout (which uses lg:w-1/2)
    // -ml-[100%] of parent (50% of container) = -50% of container, centering the 200% width element
    if (options?.layout === "fullWidth") {
      return (
        <div key={_key} className={cn("w-full", "lg:-ml-[100%] lg:w-[200%]")}>
          {blockContent}
        </div>
      );
    }

    return <div key={_key}>{blockContent}</div>;
  });
};
