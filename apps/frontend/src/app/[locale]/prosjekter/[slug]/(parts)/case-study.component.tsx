import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1, H2 } from "@/components/layout/heading.component";

type Props = {
  title?: string | null;
  subtitle?: string | null;
  client?: { _id: string; name: string | null; logo?: string | null } | null;
  keyResults?: string[] | null;
};

export function CaseStudy({ title, subtitle, client, keyResults }: Props) {
  return (
    <Container className="py-12">
      <Link
        href="/prosjekter"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til prosjekter
      </Link>

      <H1 className="mb-4">{title}</H1>
      {subtitle && <p className="text-xl text-muted-foreground mb-4">{subtitle}</p>}

      {client?.name && <p className="text-lg mb-8">Kunde: {client.name}</p>}

      {keyResults && keyResults.length > 0 && (
        <section className="mt-8">
          <H2 className="mb-4">Nøkkelresultater</H2>
          <ul className="list-disc list-inside space-y-2">
            {keyResults.map((result) => (
              <li key={result} className="text-muted-foreground">
                {result}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
