import type { FieldDefinition } from "sanity";

import { referenceField } from "./reference.field";

export const connectionsFields = (): FieldDefinition[] => {
  return [
    referenceField({
      title: "Service",
      name: "service",
      to: [{ type: "service" }],
      group: "connections",
    }),
    referenceField({
      title: "Industry",
      name: "industry",
      to: [{ type: "industry" }],
      group: "connections",
    }),
    referenceField({
      title: "Technology",
      name: "technology",
      to: [{ type: "technology" }],
      group: "connections",
    }),
  ];
};

