import { Img, type ImgProps } from "@/components/utils/img.component";
import { Link } from "@/components/utils/link.component";

export type EventCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  image?: ImgProps | null;
};

export const EventCards = ({ items }: { items: EventCardItem[] }) => (
  <div className="@container">
    <ul className="grid gap-4 @sm:grid-cols-2 @xl:grid-cols-3">
      {items.map((item) => (
        <li key={item._id}>
          <article className="group relative flex gap-4 rounded-lg border border-stroke-soft bg-container-primary p-4">
            {item.image && (
              <Img
                {...item.image}
                sizes={{ md: "third" }}
                className="h-20 w-20 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="flex flex-col justify-center">
              <h3 className="text-body-title text-text-primary">
                <Link href={`/events/${item.slug}`} className="after:absolute after:inset-0">
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
