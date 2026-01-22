import { toPlainText } from "next-sanity";
import type { AnchorItem } from "@/components/anchor-navigation.component";

type PortableTextBlock = {
  _key: string;
  _type: string;
  style?: string;
  children?: Array<{
    text?: string;
    _type: string;
  }>;
};

/**
 * Extracts h2 and h3 headings from portable text content to create anchor navigation items.
 * Uses the block's _key as a stable ID for anchor linking.
 */
export function extractAnchorsFromPortableText(
  content: PortableTextBlock[] | null | undefined,
): AnchorItem[] {
  if (!content) return [];

  // Find all h2 and h3 heading blocks
  const headingBlocks = content.filter(
    (block): block is PortableTextBlock & { style: "h2" | "h3" } => {
      return block._type === "block" && (block.style === "h2" || block.style === "h3");
    },
  );

  if (headingBlocks.length === 0) return [];

  return headingBlocks
    .map((block) => ({
      anchorId: `chapter-${block._key}`,
      label: toPlainText([block]).trim(),
    }))
    .filter((item) => item.label.length > 0);
}
