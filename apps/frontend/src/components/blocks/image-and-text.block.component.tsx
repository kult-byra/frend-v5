import { BlockContainer } from "@/components/layout/block-container.component";
import { H2 } from "@/components/layout/heading.component";
import { PortableText } from "@/components/portable-text/portable-text.component";
import { Img } from "@/components/utils/img.component";
import type { FullPortableTextQueryTypeResult } from "@/sanity-types";
import type { ImageQueryProps } from "@/server/queries/utils/image.query";
import { cn } from "@/utils/cn.util";

type ImageAndTextBlockProps = {
  _type: "imageAndText.block";
  _key: string;
  heading: string | null;
  content: NonNullable<FullPortableTextQueryTypeResult>["content"] | null;
  image: ImageQueryProps | null;
  options: {
    imagePosition: "left" | "right" | null;
  } | null;
};

export const ImageAndTextBlock = (props: ImageAndTextBlockProps) => {
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
