"use client";

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
  const hasValue = hasValueProp ?? (value !== undefined && value !== "");

  return (
    <div className="group relative w-full">
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className={cn(
          "h-[60px] w-full cursor-pointer appearance-none rounded-sm border-0 bg-container-primary px-xs pb-2xs pr-10 pt-6 text-base text-text-primary shadow-none outline-none ring-0 transition-all focus:ring-2 focus:ring-inset focus:ring-container-overlay-secondary-4 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <option value="" disabled hidden>
          {" "}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-xs transition-all duration-100",
          hasValue
            ? "top-2 text-xs text-text-secondary"
            : "top-1/2 -translate-y-1/2 text-base text-text-secondary",
        )}
      >
        {label}
      </label>

      <Icon
        name="lg-chevron-down"
        className="pointer-events-none absolute right-2xs top-1/2 size-4 -translate-y-1/2 text-text-secondary"
      />
    </div>
  );
}
