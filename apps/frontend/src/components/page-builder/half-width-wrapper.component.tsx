import type { ReactNode } from "react";
import { cn } from "@/utils/cn.util";

type HalfWidthWrapperProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Wrapper that constrains content to halfWidth and aligns it to the right.
 * Used for text content and halfWidth blocks inside full-width PortableText containers.
 *
 * Behavior:
 * - Mobile: Full width
 * - Desktop (lg+): Half width (50%), right-aligned
 */
export const HalfWidthWrapper = ({ children, className }: HalfWidthWrapperProps) => {
  return (
    <div className={cn("flex w-full justify-end")}>
      <div className={cn("w-full lg:w-1/2", className)}>{children}</div>
    </div>
  );
};
