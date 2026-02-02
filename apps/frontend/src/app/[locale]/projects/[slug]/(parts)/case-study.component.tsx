import { ContentLayout } from "@/components/layout/content-layout.component";
import { PageBuilder } from "@/components/page-builder/page-builder.component";
import { Img } from "@/components/utils/img.component";
import { Video } from "@/components/utils/video.component";
import { type HeaderTheme, SetHeaderTheme } from "@/context/header-theme.context";
import type { CaseStudyQueryResult } from "@/sanity-types";
import { cn } from "@/utils/cn.util";
import { Summary } from "./summary.component";

const aspectRatioClasses: Record<string, string> = {
  "3:2": "aspect-3/2",
  "3:4": "aspect-3/4",
  "1:1": "aspect-square",
};

type Props = NonNullable<CaseStudyQueryResult>;

const colorStyles = {
  navy: {
    bg: "bg-container-brand-1",
    title: "text-text-white-primary",
    subtitle: "text-text-white-secondary",
  },
  orange: {
    bg: "bg-container-brand-2",
    title: "text-text-white-primary",
    subtitle: "text-text-white-secondary",
  },
  white: {
    bg: "bg-container-primary",
    title: "text-text-primary",
    subtitle: "text-text-secondary",
  },
} as const;

const headerThemeMap: Record<string, HeaderTheme> = {
  navy: "dark",
  orange: "orange",
  white: "light",
};

export const CaseStudy = ({ hero, client, color, summary, pageBuilder }: Props) => {
  const scheme = colorStyles[color ?? "white"];
  const isColoredHero = color === "navy" || color === "orange";

  // Extract data from hero
  const heroData = hero?.mediaHero ?? hero?.textHero;
  const title = heroData?.title ?? null;
  const media = hero?.mediaHero?.media ?? null;

  return (
    <>
      <SetHeaderTheme theme={headerThemeMap[color ?? "white"] ?? "light"} />

      {/* Hero - full-bleed background */}
      <section
        className={cn(
          scheme.bg,
          "ml-[calc(-50vw+50%)] w-screen",
          isColoredHero ? "-mt-14 pt-[calc(var(--spacing-xl)+3.5rem)] pb-xl mb-xl" : "py-xl",
        )}
      >
        <div className="mx-auto max-w-[1920px] px-(--margin)">
          <ContentLayout>
            <div className="flex max-w-[720px] flex-col gap-xs lg:pr-md">
              {client?.name && (
                <p className={cn(scheme.subtitle, "text-body-large")}>{client.name}</p>
              )}
              {title && <h1 className={cn(scheme.title, "text-headline-1")}>{title}</h1>}
            </div>
          </ContentLayout>

          {/* Hero media */}
          {media && (media.mediaType === "image" || media.mediaType === "video") && (
            <div
              className={cn(
                "mt-md w-full overflow-hidden rounded-3xs",
                aspectRatioClasses[media.aspectRatio ?? "3:2"] ?? "aspect-3/2",
              )}
            >
              {media.mediaType === "image" && media.image && (
                <Img {...media.image} sizes={{ md: "full" }} cover className="size-full" />
              )}
              {media.mediaType === "video" && media.videoUrl && (
                <Video url={media.videoUrl} priority />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Summary */}
      <section className="bg-container-primary pb-xl">
        <div className="mx-auto max-w-[1920px] px-(--margin)">
          <ContentLayout>
            <Summary summary={summary} />
            {pageBuilder && <PageBuilder pageBuilder={pageBuilder} />}
          </ContentLayout>
        </div>
      </section>
    </>
  );
};
