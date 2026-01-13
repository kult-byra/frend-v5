import { allBlockSchemas } from "@/schemas/blocks";

export const PAGE_BUILDER_BLOCK_TYPES = Object.values(allBlockSchemas)
  .filter((schemaType) => schemaType.scope.includes("pageBuilder"))
  .map((schemaType) => schemaType.name);
