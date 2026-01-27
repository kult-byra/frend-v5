import { BlockContainer } from "@/components/layout/block-container.component";
import { Img, type ImgProps } from "@/components/utils/img.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type LogoCloudBlockProps = PageBuilderBlockProps<"logoCloud.block">;

export const LogoCloudBlock = (props: LogoCloudBlockProps) => {
  const { logos } = props;

  if (!logos || logos.length === 0) return null;

  return (
    <BlockContainer>
      <ul className="flex flex-wrap items-center justify-center gap-8">
        {logos.map((logo) => {
          if (!logo) return null;

          const image = logo.image as ImgProps | null;

          return (
            <li key={logo._id}>
              {image && <Img {...image} sizes={{ md: "third" }} className="h-12 w-auto" />}
            </li>
          );
        })}
      </ul>
    </BlockContainer>
  );
};
