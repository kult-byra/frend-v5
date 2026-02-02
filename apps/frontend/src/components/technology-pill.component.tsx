import Image from "next/image";
import { cn } from "@/lib/utils";

type Technology = {
  _id: string;
  title: string;
  logo: string | null;
};

type TechnologyPillProps = {
  technology: Technology;
  /** Apply grayscale filter to logo (default: true) */
  useGrayscale?: boolean;
};

/**
 * Displays a single technology logo pill.
 */
export function TechnologyPill({ technology, useGrayscale = true }: TechnologyPillProps) {
  return (
    <div className="flex max-w-[100px] items-center justify-center rounded-lg bg-container-shade px-xs py-2xs">
      {technology.logo ? (
        <Image
          src={technology.logo}
          alt={technology.title}
          width={100}
          height={24}
          unoptimized
          className={cn("h-6 w-auto object-contain", useGrayscale && "brightness-0")}
        />
      ) : (
        <span className="truncate text-body-small text-text-primary">{technology.title}</span>
      )}
    </div>
  );
}

type TechnologyPillsProps = {
  /** Array of technologies to display */
  technologies: Technology[];
  /** Apply grayscale filter to logos (default: true) */
  useGrayscale?: boolean;
  /** Additional classes for the container */
  className?: string;
};

/**
 * Displays a row of technology logo pills.
 *
 * @example
 * ```tsx
 * <TechnologyPills technologies={service.technologies} />
 * ```
 */
export function TechnologyPills({
  technologies,
  useGrayscale = true,
  className,
}: TechnologyPillsProps) {
  const techsWithLogos = technologies.filter((tech) => tech.logo != null);

  if (techsWithLogos.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2xs", className)}>
      {techsWithLogos.map((tech) => (
        <TechnologyPill key={tech._id} technology={tech} useGrayscale={useGrayscale} />
      ))}
    </div>
  );
}
