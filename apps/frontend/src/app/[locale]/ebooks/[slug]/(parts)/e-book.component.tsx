import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { EBookQueryResult } from "@/sanity-types";

type Props = NonNullable<EBookQueryResult>;

export function EBook({ hero }: Props) {
  // Extract title from hero
  const heroData = hero?.textHero ?? hero?.mediaHero ?? hero?.articleHero;
  const title = heroData?.title ?? null;

  return (
    <Container className="py-lg">
      <Link
        href="/ebooks"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til e-bøker
      </Link>

      {title && <H1 className="mb-4">{title}</H1>}
    </Container>
  );
}
