import {
  type PortableTextFieldProps,
  portableTextField,
} from "@/schemas/generator-fields/portable-text/portable-text.field";
import { PORTABLE_TEXT_BLOCK_TYPES } from "@/utils/portable-text-block-types.util";

export const portableTextWithBlocksField = (props?: PortableTextFieldProps) => {
  const { includeBlocks } = props ?? {};

  let blocks = PORTABLE_TEXT_BLOCK_TYPES;

  if (includeBlocks) {
    blocks = PORTABLE_TEXT_BLOCK_TYPES.filter((block) => includeBlocks.includes(block));
  }

  return portableTextField({ ...props, includeBlocks: blocks });
};
