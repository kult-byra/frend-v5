import "server-only";
import { createClient } from "next-sanity";
import { env } from "@/env";

export function getSanityWriteClient() {
  const token = env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN. Add it to .env.local for migration.");
  }

  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
    useCdn: false,
    token,
  });
}

export function isSanityWriteConfigured(): boolean {
  return !!env.SANITY_API_WRITE_TOKEN;
}
