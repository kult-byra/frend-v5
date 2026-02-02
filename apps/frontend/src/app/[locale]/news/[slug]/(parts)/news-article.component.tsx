import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { ArticleQueryResult } from "@/sanity-types";

type Props = NonNullable<ArticleQueryResult>;

export function NewsArticle({ hero }: Props) {
  // Extract title from hero
  const heroData = hero?.articleHero ?? hero?.textHero ?? hero?.mediaHero;
  const title = heroData?.title ?? null;

  return (
    <Container className="py-lg">
      <Link
        href="/articles"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til artikler
      </Link>

      {title && <H1 className="mb-4">{title}</H1>}
    </Container>
  );
}
