import * as allDocumentSchemas from "@/schemas/documents";

export const LINKABLE_TYPES = Object.values(allDocumentSchemas)
  .filter((schemaType) => schemaType?.options?.linkable)
  .map((schemaType) => schemaType.name);
