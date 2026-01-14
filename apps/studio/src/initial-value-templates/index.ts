import type { Template } from "sanity";
import { SINGLETON_TYPES } from "@/utils/singleton-types.util";
import { subServiceWithServiceInitialValueTemplate } from "./sub-service-with-service.initial-value-template";

export const initialValueTemplates = (templates: Template[]) => {
  return [
    subServiceWithServiceInitialValueTemplate,
    ...templates.filter(
      ({ schemaType }) =>
        // biome-ignore lint/suspicious/noExplicitAny: Schema type can be anything
        !SINGLETON_TYPES.includes(schemaType as any) && !["media.tag"].includes(schemaType),
    ),
  ];
};
