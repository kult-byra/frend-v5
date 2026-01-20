import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";

type Props = {
  title?: string | null;
};

export function NewsArticle({ title }: Props) {
  return (
    <Container className="py-12">
      <Link
        href="/artikler"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til artikler
      </Link>

      <H1 className="mb-4">{title}</H1>
    </Container>
  );
}
