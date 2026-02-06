import { ArticleHero } from "@/components/hero/article-hero.component";
import { Container } from "@/components/layout/container.component";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { KnowledgeArticleQueryResult } from "@/sanity-types";

type Props = NonNullable<KnowledgeArticleQueryResult>;

export function KnowledgeArticle({ hero, summary, content }: Props) {
  return (
    <>
      {hero && (
        <ArticleHero
          title={hero.title}
          media={hero.media}
          byline={hero.byline}
          excerpt={hero.excerpt}
        />
      )}

      {/* Summary section - if it exists and is different from content */}
      {summary && summary.length > 0 && (
        <section className="bg-container-primary">
          <Container>
            <ContentLayout>
              <PortableText content={summary} className="text-lg leading-[150%] text-primary" />
            </ContentLayout>
          </Container>
        </section>
      )}

      {/* Content section */}
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
