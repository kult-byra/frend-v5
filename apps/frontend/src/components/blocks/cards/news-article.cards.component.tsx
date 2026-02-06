import { Img, type ImgProps } from "@/components/utils/img.component";
import { Link } from "@/components/utils/link.component";

export type NewsArticleCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  image?: ImgProps | null;
};

export const NewsArticleCards = ({ items }: { items: NewsArticleCardItem[] }) => (
  <div className="@container">
    <ul className="grid gap-6 @sm:grid-cols-2 @xl:grid-cols-3">
      {items.map((item) => (
        <li key={item._id}>
          <article className="group relative overflow-hidden rounded-lg border border-stroke-soft bg-container-primary">
            {item.image && (
              <Img
                {...item.image}
                sizes={{ md: "half" }}
                className="aspect-video w-full object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-body-title text-text-primary">
                <Link href={`/aktuelt/${item.slug}`} className="after:absolute after:inset-0">
                  {item.title}
                </Link>
              </h3>
            </div>
          </article>
        </li>
      ))}
    </ul>
  </div>
);
