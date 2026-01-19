import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { ButtonGroup } from "@/components/ui/parts/button-group.component";
import { Img } from "@/components/utils/img.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

export const ImagesAndTextBlock = (props: PageBuilderBlockProps<"imagesAndText.block">) => {
  const { heading, content, links, images } = props;

  return (
    <BlockContainer>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          {heading && <H2 className="mb-4">{heading}</H2>}
          {content && <PortableText content={content} />}
          {links && <ButtonGroup buttons={links} className="mt-6" />}
        </div>

        <div className="grid gap-4">
          {images?.map((item) => (
            <div key={item._key}>
              {item.image && <Img {...item.image} sizes={{ md: "half" }} className="rounded-lg" />}
            </div>
          ))}
        </div>
      </div>
    </BlockContainer>
  );
};
