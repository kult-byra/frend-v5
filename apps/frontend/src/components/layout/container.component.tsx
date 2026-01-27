import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";

import { cn } from "@/utils/cn.util";

type ContainerBaseProps = {
  as?: ElementType;
  className?: string;
  fullWidth?: boolean;
  paddingX?: boolean;
  paddingY?: boolean;
};

export type ContainerProps<T extends ElementType = "div"> = ContainerBaseProps &
  Omit<ComponentPropsWithoutRef<T>, keyof ContainerBaseProps> &
  PropsWithChildren;

export const Container = <T extends ElementType = "div">({
  children,
  as,
  className,
  fullWidth,
  paddingX = true,
  paddingY = false,
  ...props
}: ContainerProps<T>) => {
  const Tag = as || "div";

  return (
    <Tag
      className={cn(
        "mx-auto w-full",
        !fullWidth && "max-w-[1920px]",
        paddingX && "px-xs",
        paddingY && "py-xs",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
