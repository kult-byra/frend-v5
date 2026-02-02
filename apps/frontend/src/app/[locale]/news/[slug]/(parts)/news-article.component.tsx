import { ArticleHero } from "@/components/hero/article-hero.component";
import { Container } from "@/components/layout/container.component";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { ArticleQueryResult } from "@/sanity-types";

type Props = NonNullable<ArticleQueryResult>;

export function NewsArticle({ hero, content }: Props) {
  return (
    <>
      {hero && (
        <ArticleHero
          title={hero.title}
          topTitle="Nyhet"
          media={hero.media}
          byline={{
            author: hero.author,
            date: hero.publishDate,
          }}
        />
      )}

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
