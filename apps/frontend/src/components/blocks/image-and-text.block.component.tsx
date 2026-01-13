import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Img } from "@/components/utils/img.component";
import { cn } from "@/utils/cn.util";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

export const ImageAndTextBlock = (props: PageBuilderBlockProps<"imageAndText.block">) => {
  const { heading, content, image, options } = props;

  const { imagePosition = "left" } = options ?? {};

  const imgRight = imagePosition === "right";

  return (
    <BlockContainer>
      <div className="grid md:grid-cols-2 gap-y-5 max-w-lg mx-auto md:max-w-none">
        {image && (
          <Img
            sizes={{ md: "half" }}
            {...image}
            className={cn("rounded-3xl", imgRight && "md:col-start-2")}
            cover
          />
        )}

        <div
          className={cn(
            "md:p-8 flex flex-col justify-center gap-y-5",
            imgRight ? "md:pr-16" : "md:pl-16",
            imgRight && "row-start-1",
          )}
        >
          <H2>{heading}</H2>

          <PortableText content={content} />
        </div>
      </div>
    </BlockContainer>
  );
};
