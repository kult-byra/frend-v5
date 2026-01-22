import { toPlainText } from "next-sanity";
import type { ChapterItem } from "@/app/[locale]/services/[slug]/(parts)/service-chapter-navigation.component";

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
 * Extracts h2 headings from portable text content to create chapter navigation items.
 * Uses the block's _key as a stable ID for anchor linking.
 */
export function extractChaptersFromPortableText(
  content: PortableTextBlock[] | null | undefined,
): ChapterItem[] {
  if (!content) return [];

  return content
    .filter((block): block is PortableTextBlock & { style: "h2" } => {
      return block._type === "block" && block.style === "h2";
    })
    .map((block) => {
      // Get the text from the block
      const title = toPlainText([block]);

      return {
        id: `chapter-${block._key}`,
        title: title.trim(),
      };
    })
    .filter((item) => item.title.length > 0);
}
