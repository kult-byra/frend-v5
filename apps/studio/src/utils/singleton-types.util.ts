import * as allDocumentSchemas from "@/schemas/documents";
import * as allSettingsSchemas from "@/schemas/settings";

export const SINGLETON_TYPES = Object.values({ ...allDocumentSchemas, ...allSettingsSchemas })
  .filter((schemaType) => schemaType?.options?.singleton)
  .map((schemaType) => schemaType.name);
