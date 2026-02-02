import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { PersonTeaser } from "@/components/teasers/person.teaser";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type PeopleBlockProps = PageBuilderBlockProps<"people.block">;

export const PeopleBlock = (props: PeopleBlockProps) => {
  const { title, excerpt, people } = props;

  if (!people || people.length === 0) return null;

  return (
    <BlockContainer>
      <div className="border-t border-stroke-soft pt-xs">
        <div className="grid gap-xs lg:grid-cols-2">
          {/* Left column: Title and excerpt */}
          <div className="flex max-w-[720px] flex-col gap-2xs pr-md">
            {title && <H2 size={2}>{title}</H2>}
            {excerpt && <PortableText content={excerpt} />}
          </div>

          {/* Right column: People grid */}
          <ul className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => {
              if (!person) return null;

              return (
                <li key={person._id}>
                  <PersonTeaser
                    _id={person._id}
                    name={person.name}
                    role={person.role_no}
                    phone={person.phone ?? null}
                    email={person.email ?? null}
                    image={person.image}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </BlockContainer>
  );
};
