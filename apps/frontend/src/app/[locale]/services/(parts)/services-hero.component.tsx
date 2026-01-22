import { toPlainText } from "next-sanity";
import { Img } from "@/components/utils/img.component";
import type { ServicesArchiveSettingsQueryResult } from "@/sanity-types";

type ArchiveSettings = NonNullable<ServicesArchiveSettingsQueryResult>;

type ServicesHeroProps = {
  title: string | null;
  excerpt: ArchiveSettings["excerpt"] | null;
  subtitle: string | null;
  media: ArchiveSettings["media"] | null;
};

export function ServicesHero({ title, excerpt, subtitle, media }: ServicesHeroProps) {
  const excerptText = excerpt ? toPlainText(excerpt) : subtitle;

  return (
    <section className="bg-container-primary px-(--margin) pb-(--spacing-md) pt-(--spacing-xl)">
      {/* Hero header - 2 column grid on desktop */}
      <div className="grid gap-(--gutter) pb-(--spacing-md) lg:grid-cols-2">
        {/* Empty left column on desktop */}
        <div className="hidden lg:block" />

        {/* Content column */}
        <div className="flex max-w-[720px] flex-col gap-(--spacing-sm)">
          {title && <h1 className="text-headline-1 text-text-primary">{title}</h1>}
          {excerptText && <p className="text-body-large text-text-primary">{excerptText}</p>}
        </div>
      </div>

      {/* Full width hero image */}
      {media?.mediaType === "image" && media.image && (
        <div className="aspect-[3/2] w-full overflow-hidden rounded">
          <Img {...media.image} sizes={{ md: "full" }} className="size-full object-cover" cover />
        </div>
      )}
    </section>
  );
}
