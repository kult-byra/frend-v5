"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  type TurnstileRef,
  type TurnstileStatus,
  TurnstileWidget,
} from "@/components/hubspot/turnstile.component";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox.component";
import { Input } from "@/components/ui/input.component";
import { Select } from "@/components/ui/select.component";
import { Textarea } from "@/components/ui/textarea.component";
import type {
  HubspotFormDetail,
  HubspotFormField,
  HubspotFormFieldGroup,
} from "@/lib/hubspot/hubspot-form.types";
import { fetchHubspotForm, submitHubspotForm } from "@/server/actions/hubspot-form.action";

type HubspotFormProps = {
  formId: string;
};

type FormValues = Record<string, string | boolean>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function HubspotForm({ formId }: HubspotFormProps) {
  const [formDefinition, setFormDefinition] = useState<HubspotFormDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("idle");
  const turnstileRef = useRef<TurnstileRef>(null);
  const [isPending, startTransition] = useTransition();
  const statusId = useId();

  const { register, handleSubmit, setValue, watch, control } = useForm<FormValues>();

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

  const onSubmit = async (data: FormValues) => {
    if (!turnstileToken) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("submitting");

    const fields = Object.entries(data)
      .filter(([, value]) => value !== "" && value !== false)
      .map(([name, value]) => ({
        name,
        value: String(value),
      }));

    const result = await submitHubspotForm({
      formId,
      fields,
      turnstileToken,
      pageUri: window.location.href,
      pageName: document.title,
    });

    if (result.success) {
      setSubmitStatus("success");
    } else {
      setSubmitStatus("error");
      turnstileRef.current?.reset();
    }
  };

  if (isLoading || isPending) {
    return (
      <div className="flex flex-col gap-2xs" aria-busy="true">
        <div className="h-[60px] w-full animate-pulse rounded-sm bg-container-primary" />
        <output className="sr-only">Laster skjema...</output>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm bg-container-tertiary-1 p-xs text-text-primary">
        <p className="text-body-small">Error: {error}</p>
      </div>
    );
  }

  if (!formDefinition) {
    return (
      <div className="rounded-sm bg-container-shade p-xs text-text-secondary">
        <p className="text-body-small">Form not found</p>
      </div>
    );
  }

  if (submitStatus === "success") {
    return (
      <output className="block rounded-sm bg-container-tertiary-3 p-sm">
        <p className="font-semibold text-text-primary">Takk!</p>
        <p className="mt-2xs text-body-small text-text-secondary">
          Skjemaet ditt har blitt sendt inn.
        </p>
      </output>
    );
  }

  const isSubmitDisabled =
    submitStatus === "submitting" ||
    turnstileStatus === "verifying" ||
    turnstileStatus === "error" ||
    !turnstileToken;

  const isSubmitting = submitStatus === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col"
      aria-busy={isSubmitting}
      aria-describedby={submitStatus === "error" ? statusId : undefined}
    >
      {/* Scrollable content area */}
      <div className="-mr-2xs flex max-h-[40vh] flex-col gap-2xs overflow-y-auto pb-sm pr-2xs">
        {formDefinition.fieldGroups?.map((group, groupIndex) => (
          <FieldGroup
            key={`${group.groupType}-${groupIndex}`}
            group={group}
            register={register}
            setValue={setValue}
            watch={watch}
            control={control}
          />
        ))}
      </div>

      {/* Fixed bottom area */}
      <div className="flex flex-col gap-2xs border-t border-stroke-soft pt-2xs">
        <TurnstileWidget
          ref={turnstileRef}
          onTokenChange={setTurnstileToken}
          onStatusChange={setTurnstileStatus}
        />

        <output
          className={`text-xs transition-opacity ${
            turnstileStatus === "verifying"
              ? "text-text-tertiary opacity-100"
              : turnstileStatus === "error"
                ? "text-stroke-error opacity-100"
                : "opacity-0"
          }`}
        >
          {turnstileStatus === "error" ? "Verifisering feilet. Prøv igjen." : "Verifiserer..."}
        </output>

        <Button type="submit" disabled={isSubmitDisabled} className="self-start">
          {isSubmitting ? "Sender..." : "Send inn"}
        </Button>

        {submitStatus === "error" && (
          <output id={statusId} className="text-xs text-stroke-error">
            Kunne ikke sende skjemaet. Vennligst prøv igjen.
          </output>
        )}
      </div>
    </form>
  );
}

type FieldGroupProps = {
  group: HubspotFormFieldGroup;
  register: ReturnType<typeof useForm<FormValues>>["register"];
  setValue: ReturnType<typeof useForm<FormValues>>["setValue"];
  watch: ReturnType<typeof useForm<FormValues>>["watch"];
  control: ReturnType<typeof useForm<FormValues>>["control"];
};

function FieldGroup({ group, register, setValue, watch, control }: FieldGroupProps) {
  if (group.groupType === "rich_text" && group.richText) {
    return (
      <div
        className="prose prose-sm text-body-small text-text-primary"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Rich text from HubSpot CMS
        dangerouslySetInnerHTML={{ __html: group.richText }}
      />
    );
  }

  if (!group.fields || group.fields.length === 0) {
    return null;
  }

  return (
    <>
      {group.fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          register={register}
          setValue={setValue}
          watch={watch}
          control={control}
        />
      ))}
    </>
  );
}

type FormFieldProps = {
  field: HubspotFormField;
  register: ReturnType<typeof useForm<FormValues>>["register"];
  setValue: ReturnType<typeof useForm<FormValues>>["setValue"];
  watch: ReturnType<typeof useForm<FormValues>>["watch"];
  control: ReturnType<typeof useForm<FormValues>>["control"];
};

function FormField({ field, register, setValue, watch, control }: FormFieldProps) {
  if (field.hidden) {
    return (
      <input type="hidden" {...register(field.name)} defaultValue={field.defaultValue ?? ""} />
    );
  }

  const label = field.label ?? field.name;
  const isRequired = field.required ?? false;
  const displayLabel = isRequired ? `${label}*` : label;
  const value = watch(field.name);
  const hasValue = value !== undefined && value !== "";

  switch (field.fieldType) {
    case "single_line_text":
    case "text":
      return (
        <Input
          id={field.name}
          label={displayLabel}
          type="text"
          {...register(field.name, { required: isRequired })}
          defaultValue={field.defaultValue ?? ""}
          hasValue={hasValue}
        />
      );

    case "email":
      return (
        <Input
          id={field.name}
          label={displayLabel}
          type="email"
          {...register(field.name, { required: isRequired })}
          defaultValue={field.defaultValue ?? ""}
          hasValue={hasValue}
        />
      );

    case "phone":
    case "phonenumber":
      return (
        <Input
          id={field.name}
          label={displayLabel}
          type="tel"
          {...register(field.name, { required: isRequired })}
          defaultValue={field.defaultValue ?? ""}
          hasValue={hasValue}
        />
      );

    case "number":
      return (
        <Input
          id={field.name}
          label={displayLabel}
          type="number"
          {...register(field.name, { required: isRequired })}
          defaultValue={field.defaultValue ?? ""}
          hasValue={hasValue}
        />
      );

    case "multi_line_text":
    case "textarea":
      return (
        <Textarea
          id={field.name}
          label={displayLabel}
          {...register(field.name, { required: isRequired })}
          defaultValue={field.defaultValue ?? ""}
          hasValue={hasValue}
        />
      );

    case "dropdown":
    case "select":
      return (
        <Controller
          name={field.name}
          control={control}
          defaultValue={field.defaultValue ?? ""}
          render={({ field: controllerField }) => (
            <Select
              id={field.name}
              label={displayLabel}
              options={field.options ?? []}
              value={String(controllerField.value ?? "")}
              onValueChange={controllerField.onChange}
              hasValue={controllerField.value !== undefined && controllerField.value !== ""}
            />
          )}
        />
      );

    case "radio":
      return (
        <fieldset className="flex flex-col gap-2xs">
          <legend className="text-body-small text-text-secondary">{displayLabel}</legend>
          <div className="flex flex-col gap-2xs">
            {field.options?.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-2xs">
                <input
                  type="radio"
                  value={option.value}
                  {...register(field.name, { required: isRequired })}
                  className="size-4 accent-button-primary-fill"
                />
                <span className="text-base text-text-primary">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );

    case "checkbox":
    case "single_checkbox":
    case "booleancheckbox":
      return (
        <Checkbox
          id={field.name}
          label={label}
          defaultChecked={field.defaultValue === "true"}
          onCheckedChange={(checked) => setValue(field.name, checked)}
        />
      );

    case "multiple_checkboxes":
      return (
        <fieldset className="flex flex-col gap-2xs">
          <legend className="text-body-small text-text-secondary">{displayLabel}</legend>
          <div className="flex flex-col gap-2xs">
            {field.options?.map((option) => {
              const checkboxId = `${field.name}-${option.value}`;
              const currentValue = String(watch(field.name) ?? "");
              return (
                <Checkbox
                  key={option.value}
                  id={checkboxId}
                  label={option.label}
                  onCheckedChange={(checked) => {
                    const values = currentValue ? currentValue.split(";") : [];
                    if (checked) {
                      values.push(option.value);
                    } else {
                      const index = values.indexOf(option.value);
                      if (index > -1) values.splice(index, 1);
                    }
                    setValue(field.name, values.join(";"));
                  }}
                />
              );
            })}
          </div>
        </fieldset>
      );

    case "date":
    case "datepicker":
      return (
        <Input
          id={field.name}
          label={displayLabel}
          type="date"
          {...register(field.name, { required: isRequired })}
          defaultValue={field.defaultValue ?? ""}
          hasValue={hasValue}
        />
      );

    default:
      return (
        <div className="rounded-sm bg-container-shade px-xs py-2xs">
          <span className="text-body-small text-text-secondary">
            The field «{label}» is not supported ({field.fieldType})
          </span>
        </div>
      );
  }
}
