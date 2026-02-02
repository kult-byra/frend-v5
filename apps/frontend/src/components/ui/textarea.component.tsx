"use client";

import { forwardRef, type TextareaHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = {
  label: string;
  hasValue?: boolean;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, hasValue: hasValueProp, onFocus, onBlur, rows = 4, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = hasValueProp ?? (props.value !== undefined && props.value !== "");
    const isFloating = isFocused || hasValue;

    return (
      <div className="group relative min-h-2xl w-full">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className="peer h-full min-h-2xl w-full resize-y rounded-sm border-0 bg-container-primary px-xs pb-2xs pt-sm text-base text-text-primary shadow-none outline-none ring-0 transition-all focus:ring-2 focus:ring-inset focus:ring-container-overlay-secondary-4"
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-xs transition-all duration-200",
            isFloating
              ? "top-2 text-xs text-text-secondary"
              : "top-4 text-base text-text-secondary",
          )}
        >
          {label}
        </label>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
