import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";
import { type ClientCardItem, ClientCards } from "./cards/client.cards.component";
import {
  type KnowledgeCardItem,
  KnowledgeCards,
  type TypeLabels,
} from "./cards/knowledge.cards.component";
import { type ServiceCardItem, ServicesCards } from "./cards/services.cards.component";

type CardsBlockProps = PageBuilderBlockProps<"cards.block">;

export const CardsBlock = (props: CardsBlockProps) => {
  const { heading, content, items, contentType } = props;
  // Additional fields from query
  const { links, allIndustries, featuredLabel, noContentFoundLabel, typeLabels } =
    props as CardsBlockProps & {
      links?: Parameters<typeof ButtonGroup>[0]["buttons"];
      allIndustries?: string[] | null;
      featuredLabel?: string | null;
      noContentFoundLabel?: string | null;
      typeLabels?: TypeLabels;
    };

  const hasItems = items && items.length > 0;

  const renderCards = () => {
    if (!hasItems) {
      return (
        <div className="flex min-h-[200px] items-center justify-center rounded bg-container-secondary">
          <p className="text-headline-3 text-text-secondary">
            {noContentFoundLabel ?? "No content found"}
          </p>
        </div>
      );
    }

    switch (contentType) {
      case "services":
        return <ServicesCards items={items as ServiceCardItem[]} />;
      case "knowledge":
        return <KnowledgeCards items={items as KnowledgeCardItem[]} typeLabels={typeLabels} />;
      case "newsEvents":
        // News & Events use the same teaser component as Knowledge
        return <KnowledgeCards items={items as KnowledgeCardItem[]} typeLabels={typeLabels} />;
      case "client":
        return (
          <ClientCards
            items={items as ClientCardItem[]}
            links={links}
            heading={heading}
            content={content}
            allIndustries={allIndustries}
            featuredLabel={featuredLabel}
          />
        );
      default:
        return <div>Card type not implemented: {contentType}</div>;
    }
  };

  // Client cards render their own header internally
  const shouldRenderHeader = contentType !== "client";
  const hasHeader = shouldRenderHeader && (heading || content || links?.length);

  return (
    <BlockContainer paddingX={false}>
      {hasHeader && (
        <div className="mb-6 flex flex-col gap-xs lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-2xs lg:pr-md">
            {heading && <H2>{heading}</H2>}
            {content && <PortableText content={content} className="text-body-large" />}
          </div>
          {links && links.length > 0 && (
            <div className="flex flex-1 items-end justify-start lg:justify-end lg:self-stretch">
              <ButtonGroup buttons={links} />
            </div>
          )}
        </div>
      )}
      {renderCards()}
    </BlockContainer>
  );
};
