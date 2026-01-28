import { KnowledgeTeaser, type KnowledgeTeaserData } from "@/components/teasers/knowledge.teaser";
import type { ImgProps } from "@/components/utils/img.component";
import type { KnowledgeContentType } from "@/server/queries/teasers/knowledge-teaser.query";

export type TypeLabels = Partial<Record<KnowledgeContentType, string | null>>;

type ServiceRef = {
  _id: string;
  title: string | null;
};

export type KnowledgeCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  image?: ImgProps | null;
  services?: ServiceRef[] | null;
};

type KnowledgeCardsProps = {
  items: KnowledgeCardItem[];
  typeLabels?: TypeLabels;
};

export const KnowledgeCards = ({ items, typeLabels }: KnowledgeCardsProps) => {
  return (
    <ul className="grid grid-cols-1 gap-xs lg:grid-cols-3 lg:gap-sm">
      {items.map((item) => (
        <li key={item._id}>
          <KnowledgeTeaser item={item as KnowledgeTeaserData} typeLabels={typeLabels} />
        </li>
      ))}
    </ul>
  );
};
