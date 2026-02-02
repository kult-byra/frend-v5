import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { SeminarQueryResult } from "@/sanity-types";

type Props = NonNullable<SeminarQueryResult>;

export function Seminar({ hero, client }: Props) {
  // Extract data from hero
  const heroData = hero?.textHero ?? hero?.mediaHero;
  const title = heroData?.title ?? null;
  const excerpt = hero?.textHero?.excerpt ?? hero?.mediaHero?.excerpt ?? null;

  return (
    <Container className="py-lg">
      <Link
        href="/seminars"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til seminarer
      </Link>

      {title && <H1 className="mb-4">{title}</H1>}
      {excerpt && <p className="text-lg mb-8">{toPlainText(excerpt)}</p>}

      {client?.name && (
        <p className="text-sm text-muted-foreground">I samarbeid med {client.name}</p>
      )}
    </Container>
  );
}
