import { defineField } from "sanity";

export const externalLinkSchema = defineField({
  name: "externalLink",
  title: "URL",
  type: "url",
  options: {
    tip: {
      title: "Tips",
      description:
        "For å lage en lenke til en e-postadresse, skriv 'mailto:' foran e-postadressen. For å lage en lenke til et telefonnummer, skriv 'tel:' foran telefonnummeret.",
      examples: ["mailto:hei@kult.design", "tel:004799361166"],
    },
  },
  validation: (Rule) =>
    Rule.uri({
      scheme: ["https", "http", "mailto", "tel"],
    }).error('Ugyldig URL. URLen må start med "https://", "http://", "mailto:" eller "tel:".'),
});
