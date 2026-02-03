import { BlockContainer } from "@/components/layout/block-container.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

export const ContentBlock = (props: PageBuilderBlockProps<"content.block">) => {
  const { content } = props;

  return (
    <BlockContainer>
      <PortableText content={content} options={{ layoutMode: "pageBuilder" }} />
    </BlockContainer>
  );
};
