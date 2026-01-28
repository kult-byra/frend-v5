import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[0.4em] whitespace-nowrap rounded-md border-2 border-transparent ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-button-primary-fill text-white hover:bg-button-primary-hover hover:text-button-primary-inverted-text",
        destructive: "bg-error text-white hover:bg-error/90",
        outline:
          "border-button-secondary-stroke bg-transparent text-button-secondary-text hover:border-button-secondary-stroke-hover hover:text-button-secondary-text-hover",
        secondary: "bg-container-secondary text-text-primary hover:bg-container-secondary/80",
        ghost: "hover:bg-container-shade text-text-primary",
        link: "underline underline-offset-4 !p-0 !font-normal !border-0 text-text-secondary hover:text-text-primary",
      },
      size: {
        default: "px-4 py-2 lg:py-1.5 text-base",
        xs: "px-2 py-0.5 text-xs",
        sm: "px-2.5 py-1 text-sm",
        lg: "px-8 py-2 text-lg",
        icon: "size-[2em]",
      },
    },
    defaultVariants: {
      variant: "default",
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

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
