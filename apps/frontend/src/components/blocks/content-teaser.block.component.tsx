import { resolvePath } from "@workspace/routing/src/resolve-path";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import { Link } from "@/components/utils/link.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type ContentTeaserBlockProps = PageBuilderBlockProps<"contentTeaser.block">;

const ctaLabels: Record<string, string> = {
  caseStudy: "Read case study",
  knowledgeArticle: "Read article",
  newsArticle: "Read article",
  seminar: "Watch seminar",
  eBook: "Download",
  event: "Read more",
};

type ManualVariant = Extract<ContentTeaserBlockProps, { title: string | null }>;

type CardData = {
  title: string | null;
  image: ImgProps | null;
  excerpt: Parameters<typeof PortableText>[0]["content"] | null;
  href: string | null;
  docType: string | null;
  links: ManualVariant["links"];
};

export const ContentTeaserBlock = (props: ContentTeaserBlockProps) => {
  const cards = normalizeCards(props);

  if (cards.length === 0) return null;

  return (
    <ul
      className={cards.length > 1 ? "grid grid-cols-1 gap-xs lg:grid-cols-2" : "grid grid-cols-1"}
    >
      {cards.map((card, i) => (
        <li key={card.href ?? i}>
          <ContentTeaserCard card={card} />
        </li>
      ))}
    </ul>
  );
};

function normalizeCards(props: ContentTeaserBlockProps): CardData[] {
  if (props.sourceType === "reference" && "documents" in props && props.documents) {
    return props.documents.filter(Boolean).map((doc) => ({
      title: doc.title,
      image: doc.image?.asset ? (doc.image as ImgProps) : null,
      excerpt: doc.excerpt as CardData["excerpt"],
      docType: doc._type,
      href: doc.slug ? resolvePath(doc._type, { slug: doc.slug }) : null,
      links: null,
    }));
  }

  if (props.sourceType === "manual" && "title" in props) {
    return [
      {
        title: props.title ?? null,
        image: props.image?.asset ? (props.image as ImgProps) : null,
        excerpt: props.excerpt as CardData["excerpt"],
        docType: null,
        href: null,
        links: props.links,
      },
    ];
  }

  return [];
}

const ContentTeaserCard = ({ card }: { card: CardData }) => {
  const { title, image, excerpt, href, docType, links } = card;
  const hasLinks = links && links.length > 0;

  return (
    <article className="group relative flex h-full flex-col gap-xs rounded bg-container-tertiary-2 p-xs">
      <div className="flex flex-1 flex-wrap gap-xs">
        {image && (
          <div className="aspect-[3/2] min-w-[240px] flex-1 overflow-hidden rounded-xs">
            <Img {...image} sizes={{ md: "half" }} className="h-full w-full" cover />
          </div>
        )}

        <div className="flex min-w-[240px] flex-1 flex-col gap-2xs">
          {title && (
            <h3 className="text-headline-3">
              {href ? (
                <Link href={href} className="after:absolute after:inset-0">
                  {title}
                </Link>
              ) : (
                title
              )}
            </h3>
          )}

          {excerpt && (
            <div className="text-body text-text-primary">
              <PortableText content={excerpt} />
            </div>
          )}

          <div className="mt-auto pt-xs">
            {hasLinks ? (
              <ButtonGroup buttons={links} />
            ) : href && docType ? (
              <Button variant="primary" asChild>
                <Link href={href}>
                  <span aria-hidden="true">{ctaLabels[docType] ?? "Read more"}</span>
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};
