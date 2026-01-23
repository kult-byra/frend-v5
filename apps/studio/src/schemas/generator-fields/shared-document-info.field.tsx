import { Languages } from "lucide-react";
import { infoField } from "./info.field";

type SharedDocumentInfoFieldOptions = {
  groups?: string[];
};

export const sharedDocumentInfoField = (options: SharedDocumentInfoFieldOptions = {}) =>
  infoField({
    name: "sharedDocumentInfo",
    title: "Shared between languages",
    description:
      "This document is shared between all languages. Fields with language-specific content are organized in separate tabs.",
    tone: "transparent",
    icon: Languages,
    group: options.groups ?? ["no", "en"],
  });
