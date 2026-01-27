import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type PeopleBlockProps = PageBuilderBlockProps<"people.block">;

export const PeopleBlock = (props: PeopleBlockProps) => {
  const { title, excerpt, people } = props;

  if (!people || people.length === 0) return null;

  return (
    <BlockContainer>
      {title && <H2>{title}</H2>}
      {excerpt && <PortableText content={excerpt} />}

      <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => {
          if (!person) return null;

          const image = person.image as ImgProps | null;

          return (
            <li key={person._id}>
              {image && (
                <Img
                  {...image}
                  sizes={{ md: "third" }}
                  className="aspect-square w-full overflow-hidden rounded"
                  cover
                />
              )}
              <p className="mt-4 font-medium">{person.name}</p>
              {person.role_no && <p>{person.role_no}</p>}
              {person.externalPerson && person.company && <p>{person.company}</p>}
            </li>
          );
        })}
      </ul>
    </BlockContainer>
  );
};
