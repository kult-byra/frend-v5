import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { ArticleQueryResult } from "@/sanity-types";

export const Article = (props: NonNullable<ArticleQueryResult>) => {
  const { title, content } = props;

  return (
    <Container>
      <H1>{title} - Article</H1>

      {content && <PortableText content={content} />}
    </Container>
  );
};
