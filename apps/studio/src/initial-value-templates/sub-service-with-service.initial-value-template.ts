import type { Template } from "sanity";

export const subServiceWithServiceInitialValueTemplate: Template = {
  id: "subServiceWithService",
  title: "Service Page with Service",
  schemaType: "subService",
  parameters: [{ name: "serviceId", type: "string" }],
  value: (params: { serviceId: string }) => ({
    service: {
      _type: "reference",
      _ref: params.serviceId,
    },
  }),
};

