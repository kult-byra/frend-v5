import { allBlockSchemas } from "./blocks";
import * as allDocumentSchemas from "./documents";
import * as allFieldSchemas from "./fields";
import * as allSettingsSchemas from "./settings";

export const documentSchemas = Object.values(allDocumentSchemas);
export const settingsSchemas = Object.values(allSettingsSchemas);
export const fieldSchemas = Object.values(allFieldSchemas);
export const blockSchemas = Object.values(allBlockSchemas);

export const schemaTypes = [
  ...fieldSchemas,
  ...blockSchemas,
  ...documentSchemas,
  ...settingsSchemas,
];
