import { SanityImage } from "sanity-image";
import { env } from "@/env";
import { cn } from "@/lib/utils";

type TechnologyPillProps = {
  technology: {
    _id: string;
    title: string;
    logo: {
      asset: { _id: string } | null;
    } | null;
  };
  useGrayscale?: boolean;
};

export function TechnologyPill({ technology, useGrayscale = true }: TechnologyPillProps) {
  const logoId = technology.logo?.asset?._id;

  return (
    <div className="flex h-8 items-center justify-center rounded px-sm py-xs bg-container-shade">
      {logoId ? (
        <SanityImage
          id={logoId}
          projectId={env.NEXT_PUBLIC_SANITY_PROJECT_ID}
          dataset={env.NEXT_PUBLIC_SANITY_DATASET}
          alt={technology.title}
          width={192}
          height={48}
          className={cn("h-full w-auto max-w-full object-contain", useGrayscale && "brightness-0")}
        />
      ) : (
        <span className="truncate text-body-small text-text-primary">{technology.title}</span>
      )}
    </div>
  );
}
