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
  const {
    links,
    clientLinks,
    knowledgeLinks,
    newsEventLinks,
    allIndustries,
    featuredLabel,
    noContentFoundLabel,
    typeLabels,
  } = props as CardsBlockProps & {
    links?: Parameters<typeof ButtonGroup>[0]["buttons"];
    clientLinks?: Parameters<typeof ButtonGroup>[0]["buttons"];
    knowledgeLinks?: Parameters<typeof ButtonGroup>[0]["buttons"];
    newsEventLinks?: Parameters<typeof ButtonGroup>[0]["buttons"];
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
            links={clientLinks}
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

  const hasServicesHeader = contentType === "services" && (content || links?.length);
  const hasKnowledgeHeader = contentType === "knowledge" && (heading || content);
  const hasNewsEventsHeader = contentType === "newsEvents" && (heading || content);
  const hasDefaultHeader =
    contentType !== "services" &&
    contentType !== "client" &&
    contentType !== "knowledge" &&
    contentType !== "newsEvents";

  return (
    <BlockContainer>
      {/* Services layout: content and button right-aligned (half-width) */}
      {hasServicesHeader && (
        <div className="mb-20 flex gap-4">
          <div className="hidden flex-1 tablet:block" />
          <div className="flex flex-1 flex-col gap-4 tablet:pr-10">
            {content && <PortableText content={content} className="text-body-large" />}
            {links && <ButtonGroup buttons={links} />}
          </div>
        </div>
      )}
      {/* Knowledge layout: heading + excerpt left, links right on desktop */}
      {hasKnowledgeHeader && (
        <div className="mb-6 flex flex-col gap-xs lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-2xs lg:pr-md">
            {heading && <H2>{heading}</H2>}
            {content && <PortableText content={content} className="text-body-large" />}
          </div>
          {knowledgeLinks && knowledgeLinks.length > 0 && (
            <div className="flex flex-1 items-end justify-start lg:justify-end lg:self-stretch">
              <ButtonGroup buttons={knowledgeLinks} />
            </div>
          )}
        </div>
      )}
      {/* News & Events layout: heading + excerpt left, links right on desktop */}
      {hasNewsEventsHeader && (
        <div className="mb-6 flex flex-col gap-xs lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-2xs lg:pr-md">
            {heading && <H2>{heading}</H2>}
            {content && <PortableText content={content} className="text-body-large" />}
          </div>
          {newsEventLinks && newsEventLinks.length > 0 && (
            <div className="flex flex-1 items-end justify-start lg:justify-end lg:self-stretch">
              <ButtonGroup buttons={newsEventLinks} />
            </div>
          )}
        </div>
      )}
      {/* Default layout for other content types */}
      {hasDefaultHeader && (
        <div className="mb-6">
          {heading && <H2 className="mb-4">{heading}</H2>}
          {content && <PortableText content={content} />}
        </div>
      )}
      {renderCards()}
    </BlockContainer>
  );
};
