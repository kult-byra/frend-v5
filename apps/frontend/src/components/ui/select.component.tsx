"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { useState } from "react";
import { Icon } from "@/components/icon.component";
import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  id?: string;
  label: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  hasValue?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  placeholder?: string;
};

export function Select({
  id,
  label,
  options,
  value,
  onValueChange,
  hasValue: hasValueProp,
  disabled,
  required,
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasValue = hasValueProp ?? (value !== undefined && value !== "");
  const isFloating = isOpen || hasValue;

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
      name={name}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="group relative w-full">
        <SelectPrimitive.Trigger
          id={id}
          className={cn(
            "flex h-[60px] w-full cursor-pointer items-end rounded-sm border-0 bg-container-primary px-xs pb-2xs pr-10 text-left text-base text-text-primary shadow-none outline-none ring-0 transition-all focus:ring-2 focus:ring-inset focus:ring-container-overlay-secondary-4 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          )}
        >
          <SelectPrimitive.Value placeholder=" " />
        </SelectPrimitive.Trigger>

        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-xs transition-all duration-100",
            isFloating
              ? "top-2 text-xs text-text-secondary"
              : "top-1/2 -translate-y-1/2 text-base text-text-secondary",
          )}
        >
          {label}
        </label>

        <Icon
          name="lg-chevron-down"
          className={cn(
            "pointer-events-none absolute right-2xs top-1/2 size-4 -translate-y-1/2 text-text-secondary transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </div>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          onKeyDown={(e) => {
            // Stop Escape from propagating to parent handlers (e.g., closing the contact widget)
            if (e.key === "Escape") {
              e.stopPropagation();
            }
          }}
          className="z-50 max-h-[min(var(--radix-select-content-available-height),300px)] w-(--radix-select-trigger-width) overflow-hidden rounded-sm bg-container-primary shadow-lg ring-1 ring-stroke-soft data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <SelectPrimitive.Viewport className="p-2xs">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-xs py-xs text-base text-text-primary outline-none transition-colors hover:bg-container-shade focus:bg-container-shade data-disabled:pointer-events-none data-disabled:opacity-50 data-[state=checked]:bg-container-secondary data-[state=checked]:font-medium"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
