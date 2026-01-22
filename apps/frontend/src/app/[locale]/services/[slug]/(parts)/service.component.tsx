import { PortableText } from "@/components/portable-text/portable-text.component";
import { StickyBottomContainer } from "@/components/sticky-bottom-container.component";
import type { ServiceQueryResult } from "@/sanity-types";
import { extractChaptersFromPortableText } from "@/utils/extract-chapters.util";
import { ServiceChapterNavigation } from "./service-chapter-navigation.component";
import { ServiceHero } from "./service-hero.component";

type Props = NonNullable<ServiceQueryResult>;

export const Service = (props: Props) => {
  const { title, excerpt, media, content } = props;

  // Extract h2 headings for chapter navigation
  // biome-ignore lint/suspicious/noExplicitAny: Content type is complex union
  const chapters = extractChaptersFromPortableText(content as any);

  return (
    <>
      {/* Hero section with mobile chapter nav */}
      <ServiceHero
        title={title}
        excerpt={excerpt}
        media={media}
        mobileChapterNav={
          chapters.length > 0 ? <ServiceChapterNavigation items={chapters} /> : null
        }
      />

      {/* Main content area */}
      <StickyBottomContainer
        stickyContent={<ServiceChapterNavigation items={chapters} />}
        className="bg-container-primary"
      >
        <div className="mx-auto max-w-[2560px] px-(--margin) pb-2xl pt-md">
          {/* Two column layout on desktop */}
          <div className="grid gap-(--gutter) lg:grid-cols-2">
            {/* Left column: empty on desktop (for sticky nav), hidden on mobile */}
            <div className="hidden lg:block" />

            {/* Right column: Content */}
            <div className="max-w-[720px]">
              <PortableText
                content={content}
                className="text-body text-text-primary"
                options={{
                  topHLevel: 2,
                }}
              />
            </div>
          </div>
        </div>
      </StickyBottomContainer>
    </>
  );
};
