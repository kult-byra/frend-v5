import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";

type Props = {
  title?: string | null;
  subtitle?: string | null;
};

export function EBook({ title, subtitle }: Props) {
  return (
    <Container className="py-12">
      <Link
        href="/ebooks"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til e-bøker
      </Link>

      <H1 className="mb-4">{title}</H1>
      {subtitle && <p className="text-xl text-muted-foreground mb-4">{subtitle}</p>}
    </Container>
  );
}
