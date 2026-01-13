import { FormInput } from "lucide-react";
import { defineField, defineType } from "sanity";

import { HubspotFormInput } from "@/components/inputs/hubspot-form-input.component";
import { stringField } from "@/schemas/generator-fields/string.field";

export const hubspotFormSchema = defineType({
  name: "hubspotForm",
  title: "HubSpot-skjema",
  type: "document",
  icon: FormInput,
  description: "Et skjema som hentes fra HubSpot og rendres med Frends design",
  fields: [
    stringField({
      name: "title",
      title: "Tittel",
      description: "Intern tittel for å identifisere skjemaet i Sanity",
      required: true,
    }),
    defineField({
      name: "formId",
      title: "HubSpot-skjema",
      description:
        "Velg et skjema fra HubSpot. Skjemaet vil rendres med Frends design på nettsiden.",
      type: "string",
      components: {
        input: HubspotFormInput,
      },
      validation: (Rule) => Rule.required().error("Du må velge et skjema fra HubSpot"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      formId: "formId",
    },
    prepare({ title, formId }) {
      return {
        title: title || "Uten tittel",
        subtitle: formId ? `HubSpot: ${formId}` : "Ikke konfigurert",
      };
    },
  },
});
