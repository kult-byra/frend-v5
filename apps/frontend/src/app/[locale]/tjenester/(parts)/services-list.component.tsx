import Link from "next/link";
import { toPlainText } from "next-sanity";
import type { ServicesListQueryResult } from "@/sanity-types";

type Props = {
  services: ServicesListQueryResult;
};

export function ServicesList({ services }: Props) {
  if (!services || services.length === 0) {
    return <p className="text-muted-foreground">Ingen tjenester funnet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Link
          key={service._id}
          href={`/tjenester/${service.slug}`}
          className="group block p-6 border rounded-lg hover:border-primary transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {service.title}
          </h2>
          {service.excerpt && (
            <p className="text-muted-foreground line-clamp-3">{toPlainText(service.excerpt)}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
