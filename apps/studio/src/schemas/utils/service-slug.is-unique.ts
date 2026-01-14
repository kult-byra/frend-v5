import type { SlugValidationContext } from "sanity";
import { env } from "@/env";
import groq from "groq";

/**
 * Generic slug uniqueness validator for service-related documents.
 * Ensures slugs are unique within each service.
 */
export const createServiceSlugIsUnique = (documentType: string) => {
  return async (slug: string, context: SlugValidationContext) => {
    const { document, getClient } = context;
    const client = getClient({ apiVersion: env.SANITY_STUDIO_API_VERSION });

    const id = document?._id?.replace(/^drafts\./, "");
    const draftId = `drafts.${id}`;

    const query = groq`
      !defined(*[
        !(_id in [$draftId, $id])
        && slug.current == $slug
        && _type == $documentType
        && $serviceId == service._ref
      ][0]._id)`;

    return client.fetch(query, {
      id,
      draftId,
      documentType,
      serviceId: (document?.service as { _ref: string })?._ref,
      slug,
    });
  };
};

// Specific validator for service pages
export const subServiceSlugIsUnique = createServiceSlugIsUnique("subService");

