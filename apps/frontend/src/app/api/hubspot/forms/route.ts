import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/env";
import { fetchHubspotSecrets } from "@/lib/hubspot/hubspot-secrets.query";

const hubspotFieldSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  fieldType: z.string(),
  required: z.boolean(),
  hidden: z.boolean().optional(),
});

const hubspotFieldGroupSchema = z.object({
  groupType: z.string(),
  richTextType: z.string(),
  fields: z.array(hubspotFieldSchema).optional(),
});

const hubspotFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  fieldGroups: z.array(hubspotFieldGroupSchema).optional(),
});

const hubspotFormsResponseSchema = z.object({
  results: z.array(hubspotFormSchema),
  paging: z
    .object({
      next: z
        .object({
          after: z.string(),
        })
        .optional(),
    })
    .optional(),
});

export type HubspotForm = z.infer<typeof hubspotFormSchema>;
export type HubspotFormsResponse = z.infer<typeof hubspotFormsResponseSchema>;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Secret",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const requestSecret = request.headers.get("X-API-Secret");

    if (!requestSecret) {
      return NextResponse.json(
        { error: "Missing X-API-Secret header" },
        { status: 401, headers: CORS_HEADERS },
      );
    }

    const secrets = await fetchHubspotSecrets();

    if (!secrets?.hubspotApiSecret) {
      return NextResponse.json(
        { error: "HubSpot API secret not configured in Sanity" },
        { status: 500, headers: CORS_HEADERS },
      );
    }

    if (requestSecret !== secrets.hubspotApiSecret) {
      return NextResponse.json(
        { error: "Invalid API secret" },
        { status: 401, headers: CORS_HEADERS },
      );
    }

    const response = await fetch("https://api.hubapi.com/marketing/v3/forms?limit=250", {
      headers: {
        Authorization: `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: unknown = await response.json().catch(() => ({}));
      const errorMessage =
        errorData && typeof errorData === "object" && "message" in errorData
          ? String(errorData.message)
          : `HubSpot API error (${response.status})`;

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status, headers: CORS_HEADERS },
      );
    }

    const rawData: unknown = await response.json();
    const parseResult = hubspotFormsResponseSchema.safeParse(rawData);

    if (!parseResult.success) {
      console.error("Failed to parse HubSpot response:", parseResult.error);
      return NextResponse.json(
        { error: "Invalid response from HubSpot API" },
        { status: 502, headers: CORS_HEADERS },
      );
    }

    return NextResponse.json(
      {
        results: parseResult.data.results,
        portalId: env.HUBSPOT_PORTAL_ID,
      },
      { headers: CORS_HEADERS },
    );
  } catch (error) {
    console.error("Error fetching HubSpot forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
