import { createClient } from "next-sanity";
import { env } from "@/env";

export const authClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
  token: env.SANITY_API_READ_TOKEN,
});
