import { env } from "@/env";

import { type StoryblokSpace, storyblokSpaceSchema } from "./storyblok.types";

const STORYBLOK_MAPI_BASE = "https://mapi.storyblok.com/v1";
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 500;

type StoryblokFetchOptions = {
  endpoint: string;
  params?: Record<string, string | number>;
};

type StoryblokPaginatedResult<T> = {
  data: T;
  total: number;
  perPage: number;
};

export function getStoryblokConfig() {
  const token = env.STORYBLOK_MANAGEMENT_TOKEN;
  const spaceId = env.STORYBLOK_SPACE_ID;
  if (!token || !spaceId) {
    return { configured: false as const };
  }
  return { configured: true as const, token, spaceId };
}

export async function storyblokFetch<T>(
  options: StoryblokFetchOptions,
): Promise<StoryblokPaginatedResult<T>> {
  const config = getStoryblokConfig();
  if (!config.configured) {
    throw new Error("Storyblok not configured");
  }

  const url = new URL(`${STORYBLOK_MAPI_BASE}/spaces/${config.spaceId}/${options.endpoint}`);
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, String(value));
    }
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(url.toString(), {
      headers: { Authorization: config.token },
      cache: "no-store",
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      const delayMs = retryAfter
        ? Number(retryAfter) * 1000
        : INITIAL_RETRY_DELAY_MS * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      lastError = new Error(`Storyblok API rate limited (429) on attempt ${attempt + 1}`);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
    }

    const total = Number(response.headers.get("total") ?? "0");
    const perPage = Number(response.headers.get("per_page") ?? "25");
    const data = (await response.json()) as T;

    return { data, total, perPage };
  }

  throw lastError ?? new Error("Storyblok API: max retries exceeded");
}

export async function fetchStoryblokSpace(): Promise<StoryblokSpace> {
  const config = getStoryblokConfig();
  if (!config.configured) {
    throw new Error("Storyblok not configured");
  }

  const url = `${STORYBLOK_MAPI_BASE}/spaces/${config.spaceId}`;
  const response = await fetch(url, {
    headers: { Authorization: config.token },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as { space: unknown };
  return storyblokSpaceSchema.parse(json.space);
}
