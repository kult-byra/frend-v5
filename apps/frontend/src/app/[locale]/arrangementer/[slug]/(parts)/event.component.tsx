import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";

type Props = {
  title?: string | null;
  subtitle?: string | null;
  timeAndDate?: {
    startTime?: string | null;
    endTime?: string | null;
  } | null;
  location?: string | null;
  price?: string | null;
};

export function Event({ title, subtitle, timeAndDate, location, price }: Props) {
  return (
    <Container className="py-12">
      <Link
        href="/artikler"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til artikler
      </Link>

      <H1 className="mb-4">{title}</H1>
      {subtitle && <p className="text-xl text-muted-foreground mb-4">{subtitle}</p>}

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
        {timeAndDate?.startTime && (
          <div>
            <span className="font-medium">Tid: </span>
            <time dateTime={timeAndDate.startTime}>
              {new Date(timeAndDate.startTime).toLocaleDateString("no-NO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        )}
        {location && (
          <div>
            <span className="font-medium">Sted: </span>
            {location}
          </div>
        )}
        {price && (
          <div>
            <span className="font-medium">Pris: </span>
            {price}
          </div>
        )}
      </div>
    </Container>
  );
}
