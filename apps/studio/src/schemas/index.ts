import { allBlockSchemas } from "./blocks";
import * as allDocumentSchemas from "./documents";
import * as allFieldSchemas from "./fields";
import * as allSettingsSchemas from "./settings";
import { enhanceWithI18nPreview } from "./utils/i18n-preview.util";

export const documentSchemas = Object.values(allDocumentSchemas);
export const settingsSchemas = Object.values(allSettingsSchemas);
export const fieldSchemas = Object.values(allFieldSchemas);
export const blockSchemas = Object.values(allBlockSchemas);

export const schemaTypes = enhanceWithI18nPreview([
  ...fieldSchemas,
  ...blockSchemas,
  ...documentSchemas,
  ...settingsSchemas,
]);
