import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";
import { type CaseStudyCardItem, CaseStudyCards } from "./cards/case-study.cards.component";
import { type ClientCardItem, ClientCards } from "./cards/client.cards.component";
import { type EventCardItem, EventCards } from "./cards/event.cards.component";
import { type NewsArticleCardItem, NewsArticleCards } from "./cards/news-article.cards.component";
import { type ServiceCardItem, ServicesCards } from "./cards/services.cards.component";

type CardsBlockProps = PageBuilderBlockProps<"cards.block">;

export const CardsBlock = (props: CardsBlockProps) => {
  const { heading, content, items, contentType } = props;
  // links, clientLinks, allIndustries, and featuredLabel fields exist in query but types not regenerated yet
  const { links, clientLinks, allIndustries, featuredLabel } = props as CardsBlockProps & {
    links?: Parameters<typeof ButtonGroup>[0]["buttons"];
    clientLinks?: Parameters<typeof ButtonGroup>[0]["buttons"];
    allIndustries?: string[] | null;
    featuredLabel?: string | null;
  };

  if (!items?.length) return null;

  const renderCards = () => {
    switch (contentType) {
      case "services":
        return <ServicesCards items={items as ServiceCardItem[]} />;
      case "newsArticle":
        return <NewsArticleCards items={items as NewsArticleCardItem[]} />;
      case "caseStudy":
        return <CaseStudyCards items={items as CaseStudyCardItem[]} />;
      case "event":
        return <EventCards items={items as EventCardItem[]} />;
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
  const hasDefaultHeader =
    contentType !== "services" && contentType !== "client" && (heading || content);

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
