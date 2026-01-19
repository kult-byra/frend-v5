import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import type { FullPortableTextQueryTypeResult } from "@/sanity-types";
import type { LinksProps } from "@/server/queries/utils/links.query";

type CallToActionBlockProps = {
  _type: "callToAction.block";
  _key: string;
  heading: string | null;
  content: NonNullable<FullPortableTextQueryTypeResult>["content"] | null;
  links: LinksProps | null;
};

export const CallToActionBlock = (props: CallToActionBlockProps) => {
  const { heading, content, links } = props;

  return (
    <BlockContainer bgColor="bg-indigo-700" className="text-white">
      <div className="mx-auto max-w-xl text-center">
        <H2>{heading}</H2>

        {content && (
          <PortableText
            className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200"
            content={content}
          />
        )}

        <ButtonGroup buttons={links} className="justify-center mt-10" />
      </div>
    </BlockContainer>
  );
};
