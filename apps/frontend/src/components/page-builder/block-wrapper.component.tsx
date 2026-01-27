import type { ReactNode } from "react";

import { cn } from "@/utils/cn.util";

type BlockWidth = "halfWidth" | "fullWidth";

type BlockWrapperProps = {
  children: ReactNode;
  width?: BlockWidth;
};

/**
 * Wrapper component for page builder blocks that handles width styling.
 * - "halfWidth": Content takes half the container width, aligned right (default)
 * - "fullWidth": Content fills the full container width
 *
 * Note: Both options stay within the 1920px page constraint.
 */
export const BlockWrapper = ({ children, width = "halfWidth" }: BlockWrapperProps) => {
  return (
    <div className={cn("flex w-full", width === "halfWidth" && "justify-end")}>
      <div className={cn("w-full", width === "halfWidth" && "lg:w-1/2")}>{children}</div>
    </div>
  );
};
