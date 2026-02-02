import { ArticleHero } from "@/components/hero/article-hero.component";
import { Container } from "@/components/layout/container.component";
import { ContentLayout } from "@/components/layout/content-layout.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Media } from "@/components/utils/media.component";
import type { PersonQueryResult } from "@/sanity-types";

type Props = NonNullable<PersonQueryResult>;

function ContactInfo({ phone, email }: { phone?: string | null; email?: string | null }) {
  if (!phone && !email) return null;

  return (
    <div className="flex flex-col gap-3xs">
      {phone && (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="w-fit text-base leading-[145%] text-primary underline"
        >
          {phone}
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="w-fit text-base leading-[145%] text-primary underline"
        >
          {email}
        </a>
      )}
    </div>
  );
}

export function Person({ name, role, media, excerpt, content, phone, email }: Props) {
  return (
    <>
      <ArticleHero title={name} topTitle={role ?? undefined} subHeading={excerpt ?? undefined} />

      {/* Contact info and media */}
      <section className="bg-container-primary">
        <Container className="pb-xl">
          <div className="grid grid-cols-1 gap-xs md:grid-cols-2">
            {/* Contact info in left column */}
            <div className="flex flex-col justify-end gap-md">
              <ContactInfo phone={phone} email={email} />
            </div>

            {/* Media in right column - show if image exists (mediaType defaults to "image" when undefined) */}
            {media?.image && (
              <Media
                mediaType="image"
                image={media.image}
                aspectRatio={media.aspectRatio ?? "3:4"}
                sizes={{ md: "half", xl: "half" }}
              />
            )}
          </div>
        </Container>
      </section>

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
