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
  className?: string;
};

export function EventInfoBox({ signupForm, className }: EventInfoBoxProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!signupForm?.formId) return null;

  return (
    <div className={cn("flex flex-col rounded-3xs bg-container-secondary", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-xs pl-xs pr-2xs pt-2xs"
      >
        <span className="pt-3xs text-base font-semibold leading-[145%] text-primary">
          Event sign up
        </span>
        <div className="flex size-8 items-center justify-center">
          <Icon name={isOpen ? "lg-collapse" : "lg-expand"} className="size-4 text-primary" />
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-xs px-xs pb-xs">
          <p className="text-base leading-[145%] text-primary">Sign up for the free event below:</p>
          <HubspotForm formId={signupForm.formId} />
          <p className="text-xs leading-[145%] text-primary">
            By submitting the form, you consent to Frend Digital AS processing your personal data.
          </p>
        </div>
      )}
    </div>
  );
}
