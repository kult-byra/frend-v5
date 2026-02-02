"use server";

import { env } from "@/env";
import { type HubspotFormDetail, hubspotFormSchema } from "@/lib/hubspot/hubspot-form.types";
import { verifyTurnstile } from "./verify-turnstile.action";

export type FetchHubspotFormResult =
  | { success: true; form: HubspotFormDetail; portalId: string }
  | { success: false; error: string };

/**
 * Fetch a HubSpot form definition by its ID.
 * This replaces the client-side fetch to /api/hubspot/forms/[formId].
 */
export async function fetchHubspotForm(formId: string): Promise<FetchHubspotFormResult> {
  if (!formId) {
    return { success: false, error: "Form ID is required" };
  }

  try {
    const response = await fetch(`https://api.hubapi.com/marketing/v3/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      const errorData: unknown = await response.json().catch(() => ({}));
      const errorMessage =
        errorData && typeof errorData === "object" && "message" in errorData
          ? String(errorData.message)
          : `HubSpot API error (${response.status})`;

      return { success: false, error: errorMessage };
    }

    const rawData: unknown = await response.json();
    const parseResult = hubspotFormSchema.safeParse(rawData);

    if (!parseResult.success) {
      console.error("Failed to parse HubSpot form response:", parseResult.error);
      return { success: false, error: "Invalid response from HubSpot API" };
    }

    return {
      success: true,
      form: parseResult.data,
      portalId: env.HUBSPOT_PORTAL_ID,
    };
  } catch (error) {
    console.error("Error fetching HubSpot form:", error);
    return { success: false, error: "Failed to fetch form" };
  }
}

export type SubmitHubspotFormResult = { success: true } | { success: false; error: string };

type FormField = {
  name: string;
  value: string;
};

type SubmitHubspotFormInput = {
  formId: string;
  fields: FormField[];
  turnstileToken: string;
  pageUri: string;
  pageName: string;
};

/**
 * Submit a HubSpot form with Turnstile verification.
 * This replaces the client-side submission to HubSpot's API.
 */
export async function submitHubspotForm(
  input: SubmitHubspotFormInput,
): Promise<SubmitHubspotFormResult> {
  const { formId, fields, turnstileToken, pageUri, pageName } = input;

  // Verify Turnstile token first
  if (!turnstileToken) {
    return { success: false, error: "Verification token is required" };
  }

  const verifyResult = await verifyTurnstile(turnstileToken);
  if (!verifyResult.success) {
    return { success: false, error: verifyResult.error ?? "Verification failed" };
  }

  const portalId = env.HUBSPOT_PORTAL_ID;

  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields,
          context: {
            pageUri,
            pageName,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData: unknown = await response.json().catch(() => ({}));
      const errorMessage =
        errorData && typeof errorData === "object" && "message" in errorData
          ? String(errorData.message)
          : "Submission failed";

      console.error("HubSpot form submission failed:", errorMessage);
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting HubSpot form:", error);
    return { success: false, error: "Failed to submit form" };
  }
}
