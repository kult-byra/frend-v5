import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1, H2 } from "@/components/layout/heading.component";
import type { ClientQueryResult } from "@/sanity-types";

type Props = NonNullable<ClientQueryResult>;

export function Client({ name, caseStudies }: Props) {
  return (
    <Container className="py-12">
      <Link
        href="/kunder"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til kunder
      </Link>

      <H1 className="mb-8">{name}</H1>

      {caseStudies && caseStudies.length > 0 && (
        <section>
          <H2 className="mb-4">Prosjekter</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseStudies.map((caseStudy) => (
              <Link
                key={caseStudy._id}
                href={`/prosjekter/${caseStudy.slug}`}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="font-medium">{caseStudy.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
