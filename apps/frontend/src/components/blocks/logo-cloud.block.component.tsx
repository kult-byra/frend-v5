import Image from "next/image";
import { BlockContainer } from "@/components/layout/block-container.component";
import type { PageBuilderBlockProps } from "../page-builder/page-builder.types";

type LogoCloudBlockProps = PageBuilderBlockProps<"logoCloud.block">;

export const LogoCloudBlock = (props: LogoCloudBlockProps) => {
  const { logos } = props;

  if (!logos || logos.length === 0) return null;

  const validLogos = logos.filter(
    (logo): logo is NonNullable<typeof logo> & { url: string } => logo?.url != null,
  );

  if (validLogos.length === 0) return null;

  return (
    <BlockContainer>
      <div className="grid grid-cols-3 gap-3xs lg:grid-cols-5">
        {validLogos.map((logo) => (
          <div
            key={logo._id}
            className="flex items-center justify-center rounded-3xs bg-container-shade px-sm py-xs"
          >
            <div className="relative aspect-3/2 w-full">
              <Image
                src={logo.url}
                alt={logo.title ?? ""}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </BlockContainer>
  );
};
