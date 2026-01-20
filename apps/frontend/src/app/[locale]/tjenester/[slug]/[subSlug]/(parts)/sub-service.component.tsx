import Link from "next/link";
import { toPlainText } from "next-sanity";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import type { SubServiceQueryResult } from "@/sanity-types";

type Props = NonNullable<SubServiceQueryResult>;

export function SubService({ title, subtitle, excerpt, parentService }: Props) {
  return (
    <Container className="py-12">
      {parentService && (
        <Link
          href={`/tjenester/${parentService.slug}`}
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
        >
          ← {parentService.title}
        </Link>
      )}

      <H1 className="mb-4">{title}</H1>
      {subtitle && <p className="text-xl text-muted-foreground mb-4">{subtitle}</p>}
      {excerpt && <p className="text-lg mb-8">{toPlainText(excerpt)}</p>}
    </Container>
  );
}
