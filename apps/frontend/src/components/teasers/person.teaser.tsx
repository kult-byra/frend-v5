import { SanityImage } from "sanity-image";
import { LinkResolver } from "@/components/utils/link-resolver.component";
import { env } from "@/env";

export type PersonTeaserProps = {
  _id: string;
  name: string | null;
  slug: string | null;
  role: string | null;
  phone: string | null;
  email: string | null;
  externalPerson?: boolean | null;
  image: {
    asset?: { _id: string } | null;
    crop?: { top: number; bottom: number; left: number; right: number } | null;
    hotspot?: { x: number; y: number; height: number; width: number } | null;
    altText?: string | null;
  } | null;
};

export const PersonTeaser = (props: PersonTeaserProps) => {
  const { name, slug, role, phone, email, externalPerson, image } = props;
  const hasPage = !externalPerson && slug;

  return (
    <article className="flex flex-col gap-xs">
      {/* Image with 3:4 aspect ratio */}
      {image?.asset?._id && (
        <div className="aspect-3/4 overflow-hidden rounded">
          <SanityImage
            id={image.asset._id}
            projectId={env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            dataset={env.NEXT_PUBLIC_SANITY_DATASET}
            alt={image.altText ?? ""}
            crop={image.crop ?? undefined}
            hotspot={image.hotspot ?? undefined}
            className="size-full object-cover"
          />
        </div>
      )}

      {/* Text content */}
      <div className="flex flex-col gap-2xs">
        {/* Name and role */}
        <div className="flex flex-col text-base leading-[1.45]">
          {name && (
            <p className="text-text-primary">
              {hasPage ? (
                <LinkResolver
                  linkType="internal"
                  _type="person"
                  slug={slug}
                  className="hover:underline"
                >
                  {name}
                </LinkResolver>
              ) : (
                name
              )}
            </p>
          )}
          {role && <p className="text-text-secondary">{role}</p>}
        </div>

        {/* Contact details */}
        {(phone || email) && (
          <div className="flex flex-col gap-3xs">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="w-fit border-b border-stroke-soft text-base leading-[1.45] text-text-primary"
              >
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="w-fit border-b border-stroke-soft text-base leading-[1.45] text-text-primary"
              >
                {email}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
