import type { FieldDefinition } from "sanity";

import { referenceField } from "./reference.field";

export const connectionsFields = (options?: {
  service?: boolean;
  industry?: boolean;
  technology?: boolean;
}): FieldDefinition[] => {
  const {
    service = true,
    industry = true,
    technology = true,
  } = options ?? {};

  return [
    ...(service
      ? [
          referenceField({
            title: "Service",
            name: "service",
            to: [{ type: "service" }],
            group: "connections",
          }),
        ]
      : []),
    ...(industry
      ? [
          referenceField({
            title: "Industry",
            name: "industry",
            to: [{ type: "industry" }],
            group: "connections",
          }),
        ]
      : []),
    ...(technology
      ? [
          referenceField({
            title: "Technology",
            name: "technology",
            to: [{ type: "technology" }],
            group: "connections",
          }),
        ]
      : []),
  ];
};

