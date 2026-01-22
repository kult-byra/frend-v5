import Link from "next/link";
import { Img, type ImgProps } from "@/components/utils/img.component";

export type CaseStudyCardItem = {
  _id: string;
  _type: string;
  title: string | null;
  slug: string | null;
  image?: ImgProps | null;
};

export const CaseStudyCards = ({ items }: { items: CaseStudyCardItem[] }) => (
  <div className="@container">
    <ul className="grid gap-6 @sm:grid-cols-2">
      {items.map((item) => (
        <li key={item._id}>
          <article className="group relative overflow-hidden rounded-xl bg-container-brand-1">
            {item.image && (
              <Img
                {...item.image}
                sizes={{ md: "half" }}
                className="aspect-4/3 w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
              />
            )}
            <div className="absolute inset-0 flex items-end p-6">
              <h3 className="text-headline-3 text-white">
                <Link href={`/case/${item.slug}`} className="after:absolute after:inset-0">
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
