"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  type TurnstileRef,
  type TurnstileStatus,
  TurnstileWidget,
} from "@/components/hubspot/turnstile.component";
import type { HubspotFormDetail, HubspotFormField } from "@/lib/hubspot/hubspot-form.types";
import { fetchHubspotForm, submitHubspotForm } from "@/server/actions/hubspot-form.action";

type NewsletterFormProps = {
  formId: string;
};

type FormValues = {
  email: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({ formId }: NewsletterFormProps) {
  const [formDefinition, setFormDefinition] = useState<HubspotFormDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("idle");
  const turnstileRef = useRef<TurnstileRef>(null);
  const [isPending, startTransition] = useTransition();
  const statusId = useId();
  const inputId = useId();

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    startTransition(async () => {
      const result = await fetchHubspotForm(formId);

      if (result.success) {
        setFormDefinition(result.form);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    });
  }, [formId]);

  // Find the email field from HubSpot form definition
  const emailField = formDefinition?.fieldGroups
    ?.flatMap((group) => group.fields ?? [])
    .find((field): field is HubspotFormField => field?.fieldType === "email");

  const onSubmit = async (data: FormValues) => {
    if (!turnstileToken || !emailField) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("submitting");

    const fields = [{ name: emailField.name, value: data.email }];

    const result = await submitHubspotForm({
      formId,
      fields,
      turnstileToken,
      pageUri: window.location.href,
      pageName: document.title,
    });

    if (result.success) {
      setSubmitStatus("success");
      reset();
    } else {
      setSubmitStatus("error");
      turnstileRef.current?.reset();
    }
  };

  if (isLoading || isPending) {
    return (
      <div className="flex flex-col gap-2xs" aria-busy="true">
        <div className="h-[52px] w-full animate-pulse rounded bg-white/20" />
        <output className="sr-only">Laster skjema...</output>
      </div>
    );
  }

  if (error || !formDefinition || !emailField) {
    return null;
  }

  if (submitStatus === "success") {
    return (
      <output className="flex h-[52px] items-center rounded bg-white px-xs text-text-primary">
        <span className="text-body">Takk for påmeldingen!</span>
      </output>
    );
  }

  const placeholder = emailField.label ?? "Add your email";
  const isRequired = emailField.required ?? false;

  const isSubmitDisabled =
    submitStatus === "submitting" ||
    turnstileStatus === "verifying" ||
    turnstileStatus === "error" ||
    !turnstileToken;

  const isSubmitting = submitStatus === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2xs"
      aria-busy={isSubmitting}
      aria-describedby={submitStatus === "error" ? statusId : undefined}
    >
      {/* Input container - white background with rounded corners */}
      <div className="group/newsletter flex items-center justify-between rounded bg-white p-xs transition-shadow focus-within:ring-2 focus-within:ring-white/50">
        <input
          id={inputId}
          type="email"
          autoComplete="email"
          placeholder={placeholder}
          {...register("email", { required: isRequired })}
          className="min-w-0 flex-1 border-0 bg-transparent text-body text-text-primary outline-none placeholder:text-text-secondary"
        />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="shrink-0 cursor-pointer rounded-sm px-2xs py-3xs text-body font-medium text-text-primary transition-all hover:bg-container-shade active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:active:scale-100"
        >
          {isSubmitting ? "..." : "Sign up"}
        </button>
      </div>

      {/* Turnstile widget (invisible) */}

      {/* Verification status - use opacity to prevent layout shift */}
      <p
        className={`text-body-small text-text-white-secondary transition-opacity ${
          !turnstileToken && turnstileStatus !== "error" ? "opacity-100" : "opacity-0"
        }`}
      >
        Verifiserer...
      </p>

      {submitStatus === "error" && (
        <output id={statusId} className="text-body-small text-stroke-error">
          Kunne ikke melde deg på. Vennligst prøv igjen.
        </output>
      )}

      <TurnstileWidget
        ref={turnstileRef}
        onTokenChange={setTurnstileToken}
        onStatusChange={setTurnstileStatus}
      />
    </form>
  );
}
