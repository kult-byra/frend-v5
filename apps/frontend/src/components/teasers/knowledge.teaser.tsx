import { resolvePath } from "@workspace/routing/src/resolve-path";
import Link from "next/link";
import type {
  KnowledgeContentType,
  KnowledgeTeaserProps,
} from "@/server/queries/teasers/knowledge-teaser.query";
import { Img } from "../utils/img.component";

export type KnowledgeTeaserData = KnowledgeTeaserProps & {
  _type: KnowledgeContentType;
};

type Props = {
  item: KnowledgeTeaserData;
  typeLabels?: Partial<Record<KnowledgeContentType, string | null>>;
};

export function KnowledgeTeaser({ item, typeLabels }: Props) {
  const { _type, title, slug, image, services } = item;
  const typeLabel = typeLabels?.[_type];
  const href = resolvePath(_type, { slug });

  return (
    <article className="group relative flex flex-col gap-xs pb-xs">
      {/* Image with service pills overlay */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xs">
        {image?.asset && <Img {...image} sizes={{ md: "third" }} className="h-full w-full" cover />}

        {/* Service pills - positioned at bottom of image */}
        {services && services.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-3xs p-xs">
            {services.map((service) => (
              <span
                key={service._id}
                className="flex h-8 items-center justify-center rounded-full bg-container-secondary px-xs text-xs leading-[1.45] text-text-primary"
              >
                {service.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-2xs pr-xs">
        {/* Type label */}
        {typeLabel && (
          <span className="text-xs leading-[1.45] text-text-secondary">{typeLabel}</span>
        )}

        {/* Title with link */}
        <h3 className="max-w-[420px] text-lg leading-[1.5] text-text-primary">
          <Link href={href} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
