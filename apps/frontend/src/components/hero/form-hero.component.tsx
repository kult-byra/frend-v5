import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { Img } from "@/components/utils/img.component";
import { Video } from "@/components/utils/video.component";
import type { FormHeroData } from "@/server/queries/utils/hero.query";

type FormHeroProps = FormHeroData;

export const FormHero = ({ title, media, form }: FormHeroProps) => {
  return (
    <section className="bg-white pb-20">
      <Container>
        <div className="flex flex-col items-center justify-center pb-20 pt-[120px]">
          {title && (
            <H1 className="max-w-[720px] text-center text-[42px] font-semibold leading-[1.1] text-primary">
              {title}
            </H1>
          )}
        </div>
      </Container>

      {media && (
        <Container>
          <div className="aspect-3/2 w-full overflow-hidden rounded">
            {media.mediaType === "image" && media.image && (
              <Img
                {...media.image}
                sizes={{ md: "full", xl: "full" }}
                cover
                className="h-full w-full [&>img]:w-full"
              />
            )}

            {media.mediaType === "video" && media.videoUrl && (
              <div className="relative size-full">
                <Video url={media.videoUrl} priority />
              </div>
            )}
          </div>
        </Container>
      )}

      {form && (
        <Container>
          <div className="mt-10">
            {/* Form will be rendered here using HubSpot or similar */}
            {/* The form reference provides: form._id, form.title, form.formId */}
          </div>
        </Container>
      )}
    </section>
  );
};
