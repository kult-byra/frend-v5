import { Globe } from "lucide-react";
import { defineField } from "sanity";
import { LinkRenderer } from "@/components/utils/link-renderer.component";

export const externalLinkObjectField = defineField({
  name: "link",
  title: "Ekstern link",
  type: "object",
  icon: Globe,
  fields: [
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      options: {
        required: true,
        tip: {
          title: "Tips",
          description:
            "For å lage en lenke til en e-postadresse, skriv 'mailto:' foran e-postadressen. For å lage en lenke til et telefonnummer, skriv 'tel:' foran telefonnummeret.",
          examples: ["mailto:hei@kult.design", "tel:004799361166"],
        },
      },
      validation: (Rule) => [
        Rule.uri({
          scheme: ["https", "http", "mailto", "tel"],
        }).error('Ugyldig URL. URLen må start med "https://", "http://", "mailto:" eller "tel:".'),

        Rule.required(),
      ],
    }),
  ],
  options: {
    collapsible: false,
    modal: {
      type: "popover",
      width: 2,
    },
  },
  components: {
    annotation: LinkRenderer,
  },
});
