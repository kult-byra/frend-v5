import { CardsBlock } from "../blocks/cards.block.component";
import { ContentBlock } from "../blocks/content.block.component";
import { JobOpeningsBlock } from "../blocks/job-openings.block.component";
import { LogoCloudBlock } from "../blocks/logo-cloud.block.component";
import { MediaGalleryBlock } from "../blocks/media-gallery.block.component";
import { PeopleBlock } from "../blocks/people.block.component";
import { QuotesBlock } from "../blocks/quotes.block.component";
import { BlockWrapper } from "./block-wrapper.component";
import type { PageBuilderType } from "./page-builder.types";

type PageBuilderProps = {
  pageBuilder: PageBuilderType;
};

// Using Record<string, any> since not all block types may be present in the generated types
// biome-ignore lint/suspicious/noExplicitAny: block components have varying props
const pageBuilderBlocks: Record<string, React.ComponentType<any>> = {
  "content.block": ContentBlock,
  "cards.block": CardsBlock,
  "quotes.block": QuotesBlock,
  "people.block": PeopleBlock,
  "logoCloud.block": LogoCloudBlock,
  "jobOpenings.block": JobOpeningsBlock,
  "mediaGallery.block": MediaGalleryBlock,
};

export const PageBuilder = (props: PageBuilderProps) => {
  const { pageBuilder } = props;

  if (!pageBuilder || pageBuilder.length === 0) return null;

  return pageBuilder.map((block) => {
    const { _type, _key, options } = block as {
      _type: string;
      _key: string;
      options?: { width?: "halfWidth" | "fullWidth" };
    };

    const Component = pageBuilderBlocks[_type];

    if (!Component) {
      return <pre key={_key}>missing block {_type}</pre>;
    }

    return (
      <BlockWrapper key={_key} width={options?.width}>
        <Component {...block} />
        {/* <p className="text-body-small text-text-secondary font-mono">
          👆 {_type}
          {options &&
            ` | ${Object.entries(options)
              .filter(([, v]) => v != null)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")}`}
        </p> */}
      </BlockWrapper>
    );
  });
};
