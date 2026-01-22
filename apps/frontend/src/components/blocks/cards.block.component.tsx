import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Icon } from "@/components/icon.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";
import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type CardsBlockProps = PageBuilderBlockProps<"cards.block">;

type ServiceMedia = {
  mediaType: "image" | "illustration" | null;
  image: ImgProps | null;
  illustration: string | null;
};

type ServiceCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  excerpt?: unknown;
  media?: ServiceMedia | null;
};

type ImageCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  image?: ImgProps | null;
};

type ClientCardItem = ImageCardItem & {
  industries?: string[] | null;
  description?: string | null;
};

const ServicesCards = ({ items }: { items: ServiceCardItem[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gutter)">
    {items.map((item) => {
      const excerptText = item.excerpt
        ? toPlainText(item.excerpt as Parameters<typeof toPlainText>[0])
        : null;

      const media = item.media;

      const MediaContent = ({ className }: { className?: string }) => (
        <>
          {media?.mediaType === "image" && media.image && (
            <Img {...media.image} sizes={{ md: "third" }} className={className} />
          )}
          {media?.mediaType === "illustration" && media.illustration && (
            <Illustration name={media.illustration as IllustrationName} className={className} />
          )}
        </>
      );

      return (
        <Link
          key={item._id}
          href={`/tjenester/${item.slug}`}
          className="group flex h-full flex-col rounded bg-container-secondary transition-colors hover:bg-container-tertiary-1"
        >
          {/* Mobile/List layout (below lg) */}
          <div className="flex flex-col lg:hidden">
            {/* Top row: illustration + title */}
            <div className="flex items-center gap-4 p-4">
              <div className="size-20 shrink-0">
                <MediaContent className="size-full object-contain" />
              </div>
              <h3 className="text-headline-3">{item.title}</h3>
            </div>
            {/* Bottom row: excerpt + arrow */}
            <div className="flex items-end gap-10 p-4 pt-0">
              {excerptText && (
                <p className="flex-1 text-body-small text-text-secondary">{excerptText}</p>
              )}
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-container-tertiary-1">
                <Icon name="arrow-right" className="size-[10px] text-text-primary" />
              </div>
            </div>
          </div>

          {/* Desktop/Grid layout (lg and up) */}
          <div className="hidden lg:flex lg:h-full lg:flex-col">
            {/* Illustration - left aligned */}
            <div className="px-4 pb-10 pt-4">
              <div className="size-[120px]">
                <MediaContent className="size-20 object-contain" />
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-1 flex-col gap-4 p-4">
              <h3 className="text-headline-3">{item.title}</h3>
              {excerptText && <p className="text-body text-text-secondary">{excerptText}</p>}
            </div>

            {/* Arrow button */}
            <div className="border-t border-stroke-soft p-4">
              <div className="flex size-8 items-center justify-center rounded-full bg-container-brand-1 transition-colors group-hover:bg-button-primary-hover">
                <Icon
                  name="arrow-right"
                  className="size-[10px] text-white transition-colors group-hover:text-button-primary-inverted-text"
                />
              </div>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
);

const NewsArticleCards = ({ items }: { items: ImageCardItem[] }) => (
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

const CaseStudyCards = ({ items }: { items: ImageCardItem[] }) => (
  <div className="grid gap-8 sm:grid-cols-2">
    {items.map((item) => (
      <div key={item._id} className="group relative overflow-hidden rounded-xl bg-gray-900">
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

const EventCards = ({ items }: { items: ImageCardItem[] }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <div key={item._id} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
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
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
    {items.map((item) => (
      <div
        key={item._id}
        className="group relative flex aspect-168/148 items-center justify-center rounded"
      >
        {/* Logo - visible by default, hidden on hover */}
        <div className="flex size-[100px] items-center justify-center transition-opacity group-hover:opacity-0">
          {item.image && (
            <Img
              {...item.image}
              sizes={{ md: "third" }}
              cover={false}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
          )}
        </div>
        <ClientCardHover item={item} />
      </div>
    ))}
  </div>
);

const ClientCardHover = ({ item }: { item: ClientCardItem }) => {
  const content = (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded bg-container-tertiary-1 p-4">
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        <p className="shrink-0 text-sm font-semibold leading-[1.45] text-text-primary">
          {item.title}
        </p>
        {item.description && (
          <p className="line-clamp-4 text-xs leading-[1.45] text-text-primary">
            {item.description}
          </p>
        )}
        {item.industries && item.industries.length > 0 && (
          <p className="shrink-0 text-xs leading-[1.45] text-text-secondary">
            {item.industries.join(", ")}
          </p>
        )}
      </div>
      {item.slug && (
        <div className="mt-4 flex size-8 shrink-0 items-center justify-center rounded-full bg-orange">
          <Icon name="arrow-top-right" className="size-3 text-dark-purple" />
        </div>
      )}
    </div>
  );

  const baseClassName =
    "absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100";

  if (item.slug) {
    return (
      <Link href={`/kunder/${item.slug}`} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return <div className={baseClassName}>{content}</div>;
};

export const CardsBlock = (props: CardsBlockProps) => {
  const { heading, content, items, contentType } = props;
  // links field exists in query but types not regenerated yet
  const links = (
    props as CardsBlockProps & { links?: Parameters<typeof ButtonGroup>[0]["buttons"] }
  ).links;

  if (!items?.length) return null;

  const renderCards = () => {
    switch (contentType) {
      case "services":
        return <ServicesCards items={items as ServiceCardItem[]} />;
      case "newsArticle":
        return <NewsArticleCards items={items as ImageCardItem[]} />;
      case "caseStudy":
        return <CaseStudyCards items={items as ImageCardItem[]} />;
      case "event":
        return <EventCards items={items as ImageCardItem[]} />;
      case "client":
        return <ClientCards items={items as ClientCardItem[]} />;
      default:
        return <div>Card type not implemented: {contentType}</div>;
    }
  };

  const hasServicesHeader = contentType === "services" && (content || links?.length);
  const hasDefaultHeader = contentType !== "services" && (heading || content);

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
        <div className="mb-8">
          {heading && <H2 className="mb-4">{heading}</H2>}
          {content && <PortableText content={content} />}
        </div>
      )}
      {renderCards()}
    </BlockContainer>
  );
};
