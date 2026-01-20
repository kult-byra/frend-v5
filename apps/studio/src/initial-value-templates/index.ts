import type { Template } from "sanity";
import { I18N_SCHEMA_TYPES } from "@/utils/i18n-schema-types.util";
import { SINGLETON_TYPES } from "@/utils/singleton-types.util";
import { subServiceWithServiceInitialValueTemplate } from "./sub-service-with-service.initial-value-template";

export const initialValueTemplates = (templates: Template[]) => {
  return [
    subServiceWithServiceInitialValueTemplate,
    ...templates.filter(({ id, schemaType }) => {
      // Filter out singleton types and media tags
      // biome-ignore lint/suspicious/noExplicitAny: Schema type can be anything
      if (SINGLETON_TYPES.includes(schemaType as any) || schemaType === "media.tag") {
        return false;
      }

      // For i18n types, only keep language-specific templates (e.g., "page-no", "page-en")
      // Filter out the base template (e.g., "page") that creates documents without language
      if ((I18N_SCHEMA_TYPES as readonly string[]).includes(schemaType) && id === schemaType) {
        return false;
      }

      return true;
    }),
  ];
};
