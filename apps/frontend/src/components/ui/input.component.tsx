"use client";

import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

type InputProps = {
  label: string;
  hasValue?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, hasValue: hasValueProp, onFocus, onBlur, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasInputValue, setHasInputValue] = useState(
      () => (props.defaultValue !== undefined && props.defaultValue !== "") || false,
    );

    const hasValue =
      hasValueProp || (props.value !== undefined && props.value !== "") || hasInputValue;
    const isFloating = isFocused || hasValue;

    return (
      <div className="group relative h-[60px] w-full">
        <input
          ref={ref}
          id={id}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            setHasInputValue(e.target.value !== "");
            onBlur?.(e);
          }}
          onChange={(e) => {
            setHasInputValue(e.target.value !== "");
            onChange?.(e);
          }}
          className="peer h-full w-full rounded-sm border-0 bg-container-primary px-xs pb-2xs pt-sm text-base text-text-primary shadow-none outline-none ring-0 transition-all focus:ring-2 focus:ring-inset focus:ring-container-overlay-secondary-4"
          {...props}
        />
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
      </div>
    );
  },
);

Input.displayName = "Input";
