import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { SeminarQueryResult } from "@/sanity-types";

type Props = NonNullable<SeminarQueryResult>;

export function Seminar({ title, subtitle, excerpt, client }: Props) {
  return (
    <Container className="py-12">
      <Link
        href="/seminarer"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til seminarer
      </Link>

      <H1 className="mb-4">{title}</H1>
      {subtitle && <p className="text-xl text-muted-foreground mb-4">{subtitle}</p>}
      {excerpt && <p className="text-lg mb-8">{toPlainText(excerpt)}</p>}

      {client?.name && (
        <p className="text-sm text-muted-foreground">I samarbeid med {client.name}</p>
      )}
    </Container>
  );
}
