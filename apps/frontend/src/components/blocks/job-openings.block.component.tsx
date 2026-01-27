import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type JobOpeningsBlockProps = PageBuilderBlockProps<"jobOpenings.block">;

export const JobOpeningsBlock = (props: JobOpeningsBlockProps) => {
  const { heading, description } = props;

  return (
    <BlockContainer>
      {heading && <H2>{heading}</H2>}
      {description && <PortableText content={description} />}

      {/* TODO: Fetch and render job openings automatically */}
      <div className="mt-8">
        <p>Job openings will be displayed here.</p>
      </div>
    </BlockContainer>
  );
};
