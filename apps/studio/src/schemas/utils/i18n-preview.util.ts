import type { PreviewConfig } from "sanity";

type PreviewSelection = Record<string, string>;

interface I18nPreviewOptions {
  /** Fields to select for preview (same as standard preview.select) */
  select: PreviewSelection;
  /** Optional prepare function to transform selected values */
  prepare?: (selection: Record<string, unknown>) => {
    title?: string;
    subtitle?: string;
    media?: unknown;
  };
}

/**
 * Creates a preview configuration that shows a warning subtitle when
 * a document has no language set (orphan document).
 *
 * @example
 * ```ts
 * export const mySchema = defineType({
 *   // ...
 *   preview: i18nPreview({
 *     select: { title: "title", media: "image" },
 *   }),
 * });
 * ```
 *
 * @example With custom prepare function
 * ```ts
 * export const mySchema = defineType({
 *   // ...
 *   preview: i18nPreview({
 *     select: { title: "title", date: "publishedAt" },
 *     prepare: ({ title, date }) => ({
 *       title: title as string,
 *       subtitle: new Date(date as string).getFullYear().toString(),
 *     }),
 *   }),
 * });
 * ```
 */
export const i18nPreview = (options: I18nPreviewOptions): PreviewConfig => {
  const { select, prepare } = options;

  return {
    select: {
      ...select,
      language: "language",
    },
    prepare: (selection) => {
      const { language, ...rest } = selection;

      // Get base preview from custom prepare or use defaults
      const basePreview = prepare
        ? prepare(rest)
        : { title: rest.title as string | undefined, media: rest.media };

      // If no language, show warning in subtitle
      if (!language) {
        return {
          ...basePreview,
          subtitle: "⚠ No language set",
        };
      }

      return basePreview;
    },
  };
};
