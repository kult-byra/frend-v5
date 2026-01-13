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
        !fullWidth && "max-w-[1750px]",
        paddingX && "px-6 md:px-9",
        paddingY && "py-6 md:py-9",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
