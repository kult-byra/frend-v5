import { stegaClean } from "@sanity/client/stega";
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/cn.util";

// Import the generated type from the sprite build
// Note: The generated file exports IconName, we alias it as IllustrationName
import type { IconName as IllustrationName } from "../../public/illustrations/name";

export type { IllustrationName };

type IllustrationProps = Omit<
  ComponentPropsWithoutRef<typeof Image>,
  "src" | "alt" | "width" | "height"
> & {
  name: IllustrationName;
  /**
   * Accessibility label for the illustration. If not provided, the illustration will be hidden from screen readers.
   * For decorative illustrations, leave this undefined.
   * For meaningful illustrations, provide a description.
   */
  label?: string;
};

/**
 * Illustration component that renders SVG illustrations as images.
 * Uses individual SVG files instead of sprite to preserve CSS-based styling.
 *
 * @example
 * // Decorative illustration (hidden from screen readers)
 * <Illustration name="light-bubbles-01" className="w-64 h-64" />
 *
 * // Meaningful illustration with label
 * <Illustration name="light-collaboration" label="Team collaboration" />
 */
export function Illustration({ name, className, label, ...props }: IllustrationProps) {
  const cleanName = stegaClean(name);
  return (
    <Image
      src={`/illustrations/${cleanName}.svg`}
      alt={label ?? ""}
      width={0}
      height={0}
      sizes="100vw"
      aria-hidden={!label}
      role={label ? "img" : "presentation"}
      className={cn("h-auto", className)}
      {...props}
    />
  );
}
