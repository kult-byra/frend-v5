import { allBlockSchemas } from "@/schemas/blocks";

export const PORTABLE_TEXT_BLOCK_TYPES = Object.values(allBlockSchemas)
  .filter((schemaType) => schemaType.scope.includes("portableText"))
  .map((schemaType) => schemaType.name);
