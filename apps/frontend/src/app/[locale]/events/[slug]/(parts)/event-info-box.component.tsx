"use client";

import { useState } from "react";
import { HubspotForm } from "@/components/hubspot/hubspot-form.component";
import { Icon } from "@/components/icon.component";
import { cn } from "@/utils/cn.util";

type SignupForm = {
  _id: string;
  title: string | null;
  formId: string | null;
} | null;

type EventInfoBoxProps = {
  signupForm: SignupForm;
  title: string;
  className?: string;
};

export function EventInfoBox({ signupForm, title, className }: EventInfoBoxProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!signupForm?.formId) return null;

  return (
    <div className={cn("flex flex-col rounded-3xs bg-container-secondary", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-xs pl-xs pr-2xs pt-2xs"
      >
        <span className="pt-3xs text-base font-semibold leading-[145%] text-primary">{title}</span>
        <div className="flex size-8 items-center justify-center">
          <Icon name={isOpen ? "lg-collapse" : "lg-expand"} className="size-4 text-primary" />
        </div>
      </button>

      {isOpen && (
        <div className="px-xs pb-xs">
          <HubspotForm formId={signupForm.formId} />
        </div>
      )}
    </div>
  );
}
