import Link from "next/link";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";

type Props = {
  title?: string | null;
  subtitle?: string | null;
  publishDate?: string | null;
  author?: {
    _id: string;
    name: string | null;
    image?: string | null;
  } | null;
};

export function KnowledgeArticle({ title, subtitle, publishDate, author }: Props) {
  return (
    <Container className="py-lg">
      <Link
        href="/knowledge"
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← Tilbake til kunnskap
      </Link>

      <H1 className="mb-4">{title}</H1>
      {subtitle && <p className="text-xl text-muted-foreground mb-4">{subtitle}</p>}

      <div className="flex items-center gap-xs text-sm text-muted-foreground mb-8">
        {author?.name && <span>Av {author.name}</span>}
        {publishDate && (
          <time dateTime={publishDate}>
            {new Date(publishDate).toLocaleDateString("no-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </div>
    </Container>
  );
}
