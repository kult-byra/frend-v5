"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { forwardRef } from "react";
import { Icon } from "@/components/icon.component";

type CheckboxProps = {
  id: string;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export const Checkbox = forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ id, label, checked, defaultChecked, onCheckedChange }, ref) => {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-xs">
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(value) => {
          if (typeof value === "boolean") {
            onCheckedChange?.(value);
          }
        }}
        className="peer size-6 shrink-0 rounded-sm border-2 border-stroke-soft bg-container-primary transition-colors hover:border-stroke-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-button-primary-fill data-[state=checked]:bg-button-primary-fill data-[state=checked]:text-button-primary-text"
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Icon name="checkmark" className="size-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span className="text-base text-text-primary">{label}</span>
    </label>
  );
});

Checkbox.displayName = "Checkbox";
