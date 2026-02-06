import { ArticleHero, type ArticleHeroColorScheme } from "@/components/hero/article-hero.component";
import { Container } from "@/components/layout/container.component";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ScrollFadeBackground } from "@/components/utils/scroll-fade-background.component";
import { type HeaderTheme, SetHeaderTheme } from "@/context/header-theme.context";
import type { CaseStudyQueryResult } from "@/sanity-types";
import { Summary } from "./summary.component";

type Props = NonNullable<CaseStudyQueryResult>;

const colorToBgClass: Record<string, string> = {
  navy: "bg-container-brand-1",
  yellow: "bg-container-overlay-secondary-3",
  white: "bg-container-primary",
};

const headerThemeMap: Record<string, HeaderTheme> = {
  navy: "navy",
  yellow: "yellow",
  white: "white",
};

export const CaseStudy = ({ hero, client, color, summary, content }: Props) => {
  const colorKey = (color && color in colorToBgClass ? color : "white") as ArticleHeroColorScheme;
  const bgClass = colorToBgClass[colorKey] ?? "bg-container-primary";
  const isColoredHero = colorKey === "navy" || colorKey === "yellow";

  // Extract title from hero
  const title = hero?.title ?? "";

  // Get media array from hero, filter to only image/video types (exclude illustrations)
  const media =
    hero?.media?.filter((m) => m.mediaType === "image" || m.mediaType === "video") ?? null;

  const pageContent = (
    <>
      <SetHeaderTheme theme={headerThemeMap[colorKey] ?? "white"} />

      <ArticleHero
        title={title}
        label={client?.name ?? undefined}
        media={media}
        excerpt={hero?.excerpt}
        colorScheme={colorKey}
        transparentBg={isColoredHero}
        extendBehindHeader={isColoredHero}
      />

      {/* Summary */}
      {summary && (
        <section className="pb-xl">
          <div className="mx-auto max-w-[1920px] px-(--margin)">
            <ContentLayout>
              <Summary summary={summary} />
            </ContentLayout>
          </div>
        </section>
      )}

      {/* Content */}
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

  // For colored heroes, wrap with scroll-fading background
  if (isColoredHero) {
    return <ScrollFadeBackground bgClass={bgClass}>{pageContent}</ScrollFadeBackground>;
  }

  return pageContent;
};
