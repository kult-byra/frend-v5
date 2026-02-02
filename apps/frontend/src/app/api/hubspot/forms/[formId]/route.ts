import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/env";

const hubspotFieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  displayOrder: z.number().optional(),
  description: z.string().optional(),
});

const hubspotFieldValidationSchema = z.object({
  blockedEmailDomains: z.array(z.string()).optional(),
  minAllowedDigits: z.number().optional(),
  maxAllowedDigits: z.number().optional(),
});

const hubspotFieldSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  fieldType: z.string(),
  objectTypeId: z.string().optional(),
  required: z.boolean().optional(),
  hidden: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  defaultValue: z.string().optional(),
  options: z.array(hubspotFieldOptionSchema).optional(),
  validation: hubspotFieldValidationSchema.optional(),
});

const hubspotFieldGroupSchema = z.object({
  groupType: z.string(),
  richTextType: z.string().optional(),
  richText: z.string().optional(),
  fields: z.array(hubspotFieldSchema).optional(),
});

const hubspotFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  fieldGroups: z.array(hubspotFieldGroupSchema).optional(),
  configuration: z
    .object({
      language: z.string().optional(),
      postSubmitAction: z
        .object({
          type: z.string().optional(),
          value: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type HubspotFormField = z.infer<typeof hubspotFieldSchema>;
export type HubspotFormFieldGroup = z.infer<typeof hubspotFieldGroupSchema>;
export type HubspotFormDetail = z.infer<typeof hubspotFormSchema>;

type RouteContext = {
  params: Promise<{ formId: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { formId } = await context.params;

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

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const rawData: unknown = await response.json();
    const parseResult = hubspotFormSchema.safeParse(rawData);

    if (!parseResult.success) {
      console.error("Failed to parse HubSpot form response:", parseResult.error);
      return NextResponse.json({ error: "Invalid response from HubSpot API" }, { status: 502 });
    }

    return NextResponse.json({
      form: parseResult.data,
      portalId: env.HUBSPOT_PORTAL_ID,
    });
  } catch (error) {
    console.error("Error fetching HubSpot form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
