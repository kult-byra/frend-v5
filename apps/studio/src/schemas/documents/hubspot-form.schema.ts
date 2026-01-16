import { FormInput } from "lucide-react";
import { defineField, defineType } from "sanity";

import { HubspotFormInput } from "@/components/inputs/hubspot-form-input.component";
import { stringField } from "@/schemas/generator-fields/string.field";

export const hubspotFormSchema = defineType({
  name: "hubspotForm",
  title: "HubSpot form",
  type: "document",
  icon: FormInput,
  description: "A form that is fetched from HubSpot and rendered with Frends design",
  fields: [
    stringField({
      name: "title",
      title: "Title",
      description: "Internal title to identify the form in Sanity",
      required: true,
    }),
    defineField({
      name: "formId",
      title: "HubSpot form",
      description:
        "Select a form from HubSpot. The form will be rendered with Frends design on the website.",
      type: "string",
      components: {
        input: HubspotFormInput,
      },
      validation: (Rule) => Rule.required().error("You must select a form from HubSpot"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      formId: "formId",
    },
    prepare({ title, formId }) {
      return {
        title: title || "Without title",
        subtitle: formId ? `HubSpot: ${formId}` : "Not configured",
      };
    },
  },
});
