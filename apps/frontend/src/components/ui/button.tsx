import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2xs whitespace-nowrap rounded-md border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-soft focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-normal text-base leading-[145%]",
  {
    variants: {
      variant: {
        primary:
          "bg-buttons-primary-fill text-buttons-primary-text border-transparent hover:bg-buttons-primary-fill-hover",
        secondary:
          "bg-transparent text-buttons-secondary-text border-buttons-secondary-stroke hover:border-buttons-secondary-stroke-hover hover:text-buttons-secondary-text-hover",
      },
      size: {
        default: "h-11 px-4 lg:h-[39px]",
        icon: "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
