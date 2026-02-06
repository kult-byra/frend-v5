import { ArticleHero } from "@/components/hero/article-hero.component";
import { Container } from "@/components/layout/container.component";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { EBookQueryResult } from "@/sanity-types";

type Props = NonNullable<EBookQueryResult>;

export function EBook({ hero, content }: Props) {
  return (
    <>
      {hero && <ArticleHero title={hero.title} media={hero.media} excerpt={hero.excerpt} />}

      {content && content.length > 0 && (
        <section className="bg-container-primary pb-xl">
          <Container>
            <ContentLayout>
              <PortableText content={content} />
            </ContentLayout>
          </Container>
        </section>
      )}
    </>
  );
}
