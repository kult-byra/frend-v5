import { z } from "zod";

export const hubspotFieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  displayOrder: z.number().optional(),
  description: z.string().optional(),
});

export const hubspotFieldValidationSchema = z.object({
  blockedEmailDomains: z.array(z.string()).optional(),
  minAllowedDigits: z.number().optional(),
  maxAllowedDigits: z.number().optional(),
});

export const hubspotFieldSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  fieldType: z.string(),
  objectTypeId: z.string().optional(),
  required: z.boolean().optional(),
  hidden: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  defaultValue: z.string().optional(),
  options: z.array(hubspotFieldOptionSchema).optional(),
  validation: hubspotFieldValidationSchema.optional(),
});

export const hubspotFieldGroupSchema = z.object({
  groupType: z.string(),
  richTextType: z.string().optional(),
  richText: z.string().optional(),
  fields: z.array(hubspotFieldSchema).optional(),
});

export const hubspotFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  fieldGroups: z.array(hubspotFieldGroupSchema).optional(),
  configuration: z
    .object({
      language: z.string().optional(),
      postSubmitAction: z
        .object({
          type: z.string().optional(),
          value: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type HubspotFieldOption = z.infer<typeof hubspotFieldOptionSchema>;
export type HubspotFormField = z.infer<typeof hubspotFieldSchema>;
export type HubspotFormFieldGroup = z.infer<typeof hubspotFieldGroupSchema>;
export type HubspotFormDetail = z.infer<typeof hubspotFormSchema>;
