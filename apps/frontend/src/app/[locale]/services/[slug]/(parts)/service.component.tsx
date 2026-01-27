import { AnchorNavigation } from "@/components/anchor-navigation.component";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { StickyBottomContainer } from "@/components/sticky-bottom-container.component";
import type { ServiceQueryResult } from "@/sanity-types";
import { extractAnchorsFromPortableText } from "@/utils/extract-chapters.util";
import { ServiceHero } from "./service-hero.component";

type Props = NonNullable<ServiceQueryResult> & {
  chaptersLabel: string;
};

export const Service = (props: Props) => {
  const { title, excerpt, media, content, chaptersLabel } = props;

  // Extract h2 headings for anchor navigation
  // biome-ignore lint/suspicious/noExplicitAny: Content type is complex union
  const anchors = extractAnchorsFromPortableText(content as any);

  return (
    <>
      {/* Hero section with mobile anchor nav */}
      <ServiceHero
        title={title}
        excerpt={excerpt}
        media={media}
        mobileAnchorNav={
          anchors.length > 0 ? <AnchorNavigation items={anchors} label={chaptersLabel} /> : null
        }
      />

      {/* Main content area */}
      <StickyBottomContainer
        stickyContent={
          anchors.length > 0 ? <AnchorNavigation items={anchors} label={chaptersLabel} /> : null
        }
        className="bg-container-primary"
      >
        <div className="mx-auto max-w-[1920px] px-(--margin) pb-2xl pt-md">
          <ContentLayout>
            <div className="max-w-[720px]">
              <PortableText
                content={content}
                className="text-body text-text-primary"
                options={{
                  topHLevel: 2,
                }}
              />
            </div>
          </ContentLayout>
        </div>
      </StickyBottomContainer>
    </>
  );
};
