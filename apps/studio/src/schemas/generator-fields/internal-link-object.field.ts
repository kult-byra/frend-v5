import { Link } from "lucide-react";
import { defineField } from "sanity";

import { LinkRenderer } from "@/components/utils/link-renderer.component";

export const internalLinkObjectField = defineField({
  name: "internalLinkObject",
  title: "Intern link",
  type: "object",
  icon: Link,
  fields: [
    defineField({
      name: "internalLink",
      title: "Velg dokument",
      type: "internalLink",
      options: {
        disableNew: true,
        required: true,
      },
      validation: (Rule) => Rule.required(),
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
