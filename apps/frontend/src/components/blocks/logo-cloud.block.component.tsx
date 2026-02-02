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
      <div className="flex flex-wrap items-center justify-center gap-lg">
        {validLogos.map((logo) => (
          <div key={logo._id} className="flex items-center justify-center">
            <Image
              src={logo.url}
              alt={logo.title ?? ""}
              width={120}
              height={48}
              unoptimized
              className="h-12 w-auto object-contain grayscale"
            />
          </div>
        ))}
      </div>
    </BlockContainer>
  );
};
