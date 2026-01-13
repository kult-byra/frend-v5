import { buildSrc, type ImageQueryInputs } from "@sanity-image/url-builder";
import { env } from "@/env";

const baseUrl = `https://cdn.sanity.io/images/${env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${env.NEXT_PUBLIC_SANITY_DATASET}`;

export const urlForImage = (source: ImageQueryInputs) => {
  return buildSrc({
    ...source,
    baseUrl,
  }).src;
};

export const urlForImageId = (id: string, options?: Omit<ImageQueryInputs, "id">) => {
  return buildSrc({
    ...options,
    id,
    baseUrl,
  }).src;
};
