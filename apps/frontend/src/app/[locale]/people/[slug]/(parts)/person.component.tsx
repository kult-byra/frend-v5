import { ArticleHero } from "@/components/hero/article-hero.component";
import { Container } from "@/components/layout/container.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Media } from "@/components/utils/media.component";
import type { PersonQueryResult } from "@/sanity-types";
import { PersonInfoWidget } from "./person-info-widget.component";

type Props = NonNullable<PersonQueryResult>;

export function Person({
  name,
  role,
  media,
  excerpt,
  content,
  phone,
  email,
  profileLinks,
  expertise,
}: Props) {
  const hasWidgetContent =
    phone ||
    email ||
    (profileLinks && profileLinks.length > 0) ||
    (expertise && expertise.length > 0);
  const hasContent = content && content.length > 0;

  return (
    <>
      <ArticleHero title={name} label={role ?? undefined} subheading={excerpt ?? undefined} />

      <section className="bg-container-primary">
        <Container className="pb-xl">
          <div className="grid grid-cols-1 gap-xs lg:grid-cols-2">
            {/* Left column: Sticky widget on desktop */}
            <div className="order-2 lg:order-1">
              {hasWidgetContent && (
                <div className="lg:sticky lg:top-xl">
                  <PersonInfoWidget
                    phone={phone}
                    email={email}
                    profileLinks={profileLinks}
                    expertise={expertise}
                    className="w-full lg:max-w-[420px]"
                  />
                </div>
              )}
            </div>

            {/* Right column: Media and content */}
            <div className="order-1 flex flex-col gap-xl lg:order-2">
              {/* Media - show if image exists */}
              {media?.image && (
                <Media
                  mediaType="image"
                  image={media.image}
                  aspectRatio={media.aspectRatio ?? "3:4"}
                  sizes={{ md: "half", xl: "half" }}
                />
              )}

              {/* Content */}
              {hasContent && (
                <div className="prose max-w-none">
                  <PortableText content={content} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
