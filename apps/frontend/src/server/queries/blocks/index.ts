import { callToActionBlockQuery } from "@/server/queries/blocks/call-to-action.block.query";
import { imageAndTextBlockQuery } from "@/server/queries/blocks/image-and-text.block.query";

export const blockQueries: Record<string, string> = {
  callToActionBlockQuery,
  imageAndTextBlockQuery,
};
