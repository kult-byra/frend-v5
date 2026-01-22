import type { ImgProps } from "@/components/utils/img.component";
import type { ServicesListQueryResult } from "@/sanity-types";
import { ServiceCard } from "./service-card.component";

type Props = {
  services: ServicesListQueryResult;
};

type ServiceMedia = {
  mediaType: "image" | "illustration" | null;
  image: ImgProps | null;
  illustration: string | null;
};

export function ServicesList({ services }: Props) {
  if (!services || services.length === 0) {
    return <p className="text-text-secondary">Ingen tjenester funnet.</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gutter)">
      {services.map((service) => (
        <ServiceCard
          key={service._id}
          title={service.title ?? ""}
          slug={service.slug ?? ""}
          excerpt={service.excerpt}
          media={service.media as ServiceMedia | null}
          technologies={service.technologies}
        />
      ))}
    </div>
  );
}
