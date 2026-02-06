import { DetailedBylineList } from "@/components/detailed-byline.component";
import { ArticleHero } from "@/components/hero/article-hero.component";
import { Container } from "@/components/layout/container.component";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { ArticleQueryResult } from "@/sanity-types";

type Props = NonNullable<ArticleQueryResult> & {
  showMoreLabel: string;
  showLessLabel: string;
};

export function NewsArticle({
  hero,
  content,
  detailedAuthors,
  showMoreLabel,
  showLessLabel,
}: Props) {
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

      {content && content.length > 0 && (
        <section className="bg-container-primary pb-xl">
          <Container>
            <ContentLayout>
              <PortableText content={content} />
            </ContentLayout>
          </Container>
        </section>
      )}

      <DetailedBylineList
        authors={detailedAuthors}
        showMoreLabel={showMoreLabel}
        showLessLabel={showLessLabel}
      />
    </>
  );
}
