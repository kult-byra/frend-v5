import type { PreviewConfig, SchemaTypeDefinition } from "sanity";
import { I18N_SCHEMA_TYPES } from "@/utils/i18n-schema-types.util";

/**
 * Enhances schema types with i18n preview warning.
 * For i18n document types, adds a "No language set" warning to the subtitle
 * when the document has no language assigned.
 */
export const enhanceWithI18nPreview = (schemas: SchemaTypeDefinition[]): SchemaTypeDefinition[] => {
  return schemas.map((schema) => {
    // Only enhance i18n document types
    if (!(I18N_SCHEMA_TYPES as readonly string[]).includes(schema.name)) {
      return schema;
    }

    // Get existing preview config or create default
    const existingPreview = (schema as { preview?: PreviewConfig }).preview;
    const existingSelect = existingPreview?.select ?? { title: "title" };
    const existingPrepare = existingPreview?.prepare;

    return {
      ...schema,
      preview: {
        select: {
          ...existingSelect,
          _i18n_language: "language",
        },
        // biome-ignore lint/suspicious/noExplicitAny: Sanity preview types are complex
        prepare: (selection: Record<string, any>) => {
          const { _i18n_language, ...rest } = selection;

          // Get base preview from existing prepare or use defaults
          const basePreview = existingPrepare
            ? existingPrepare(rest)
            : {
                title: rest.title as string | undefined,
                subtitle: rest.subtitle as string | undefined,
                media: rest.media,
              };

          // If no language, override subtitle with warning
          if (!_i18n_language) {
            return {
              ...basePreview,
              subtitle: "⚠ No language set",
            };
          }

          // Language is set - return base preview with its subtitle intact
          return basePreview;
        },
      },
    } as SchemaTypeDefinition;
  });
};
