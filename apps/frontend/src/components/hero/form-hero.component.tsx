import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { Media } from "@/components/utils/media.component";
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
          <Media
            mediaType={media.mediaType ?? "image"}
            image={media.image}
            videoUrl={media.videoUrl}
            illustration={media.illustration}
            aspectRatio={media.aspectRatio}
            priority
            sizes={{ md: "full", xl: "full" }}
            className="w-full"
          />
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
