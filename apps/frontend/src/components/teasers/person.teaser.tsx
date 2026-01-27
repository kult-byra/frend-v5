import { Img, type ImgProps } from "@/components/utils/img.component";

export type PersonTeaserProps = {
  _id: string;
  name: string | null;
  role: string | null;
  phone: string | null;
  email: string | null;
  image: ImgProps | null;
};

export const PersonTeaser = (props: PersonTeaserProps) => {
  const { name, role, phone, email, image } = props;

  return (
    <article className="flex flex-col gap-xs">
      {/* Image with 3:4 aspect ratio */}
      {image && (
        <Img
          {...image}
          sizes={{ md: "third" }}
          className="aspect-3/4 w-full overflow-hidden rounded-xs"
          cover
        />
      )}

      {/* Text content */}
      <div className="flex flex-col gap-2xs">
        {/* Name and role */}
        <div className="flex flex-col text-base leading-[1.45]">
          {name && <p className="text-text-primary">{name}</p>}
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
