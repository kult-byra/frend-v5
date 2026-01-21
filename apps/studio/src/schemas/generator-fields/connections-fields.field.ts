import type { FieldDefinition } from "sanity";

import { referenceField } from "./reference.field";

export const connectionsFields = (options?: {
  service?: boolean;
  industry?: boolean;
  technology?: boolean;
}): FieldDefinition[] => {
  const { service = true, industry = true, technology = true } = options ?? {};

  return [
    ...(service
      ? [
          referenceField({
            title: "Services",
            name: "services",
            to: [{ type: "service" }],
            group: "connections",
            allowMultiple: true,
          }),
        ]
      : []),
    ...(industry
      ? [
          referenceField({
            title: "Industries",
            name: "industries",
            to: [{ type: "industry" }],
            group: "connections",
            allowMultiple: true,
          }),
        ]
      : []),
    ...(technology
      ? [
          referenceField({
            title: "Technologies",
            name: "technologies",
            to: [{ type: "technology" }],
            group: "connections",
            allowMultiple: true,
          }),
        ]
      : []),
  ];
};
