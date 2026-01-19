import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Img } from "@/components/utils/img.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type CardsBlockProps = PageBuilderBlockProps<"cards.block">;
type CardItem = NonNullable<CardsBlockProps["items"]>[number];
type ClientCardItem = CardItem & {
  industries?: string[];
  description?: string;
};

const ServicesCards = ({ items }: { items: CardItem[] }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <div
        key={item._id}
        className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
      >
        {item.image && (
          <Img
            {...item.image}
            sizes={{ md: "half" }}
            className="mb-4 aspect-video rounded-md object-cover"
          />
        )}
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
      </div>
    ))}
  </div>
);

const NewsArticleCards = ({ items }: { items: CardItem[] }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <article
        key={item._id}
        className="overflow-hidden rounded-lg border border-gray-200 bg-white"
      >
        {item.image && (
          <Img
            {...item.image}
            sizes={{ md: "half" }}
            className="aspect-[16/9] w-full object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
        </div>
      </article>
    ))}
  </div>
);

const CaseStudyCards = ({ items }: { items: CardItem[] }) => (
  <div className="grid gap-8 sm:grid-cols-2">
    {items.map((item) => (
      <div
        key={item._id}
        className="group relative overflow-hidden rounded-xl bg-gray-900"
      >
        {item.image && (
          <Img
            {...item.image}
            sizes={{ md: "half" }}
            className="aspect-[4/3] w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
          />
        )}
        <div className="absolute inset-0 flex items-end p-6">
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
        </div>
      </div>
    ))}
  </div>
);

const EventCards = ({ items }: { items: CardItem[] }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <div
        key={item._id}
        className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4"
      >
        {item.image && (
          <Img
            {...item.image}
            sizes={{ md: "third" }}
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
        </div>
      </div>
    ))}
  </div>
);

const ClientCards = ({ items }: { items: ClientCardItem[] }) => (
  <div className="grid grid-cols-2 gap-(--gutter) tablet:grid-cols-6">
    {items.map((item) => (
      <div
        key={item._id}
        className="group relative flex aspect-[168/148] items-center justify-center rounded bg-container-shade p-6"
      >
        {item.image && (
          <Img
            {...item.image}
            sizes={{ md: "third" }}
            cover={true}
            className="w-full mix-blend-multiply"
          />
        )}
        <ClientCardHover item={item} />
      </div>
    ))}
  </div>
);

const ClientCardHover = ({ item }: { item: ClientCardItem }) => {
  const content = (
    <div className="flex w-[260px] flex-col gap-4 rounded bg-container-tertiary-1 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-body-title text-text-primary">{item.title}</p>
        {item.description && (
          <p className="text-body-small text-text-primary">
            {item.description}
          </p>
        )}
        {item.industries && item.industries.length > 0 && (
          <p className="text-body-small text-text-secondary">
            {item.industries.join(", ")}
          </p>
        )}
      </div>
      {item.slug && (
        <div className="flex size-8 items-center justify-center rounded-full bg-orange">
          <ArrowUpRight className="size-3 text-dark-purple" />
        </div>
      )}
    </div>
  );

  const className =
    "absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100";

  if (item.slug) {
    return (
      <Link href={`/kunder/${item.slug}`} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

export const CardsBlock = (props: CardsBlockProps) => {
  const { heading, content, items, contentType } = props;

  if (!items?.length) return null;

  const renderCards = () => {
    switch (contentType) {
      case "services":
        return <ServicesCards items={items} />;
      case "newsArticle":
        return <NewsArticleCards items={items} />;
      case "caseStudy":
        return <CaseStudyCards items={items} />;
      case "event":
        return <EventCards items={items} />;
      case "client":
        return <ClientCards items={items} />;
      default:
        return <div>Card type not implemented: {contentType}</div>;
    }
  };

  return (
    <BlockContainer>
      {heading && <H2 className="mb-4">{heading}</H2>}
      {content && <PortableText content={content} className="mb-8" />}
      {renderCards()}
    </BlockContainer>
  );
};
