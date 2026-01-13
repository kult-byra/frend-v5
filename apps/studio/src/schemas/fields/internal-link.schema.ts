import { defineField } from "sanity";
import { LINKABLE_TYPES } from "@/utils/linkable-types.util";

export const internalLinkSchema = defineField({
  name: "internalLink",
  title: "Velg dokument",
  type: "reference",
  to: LINKABLE_TYPES.map((type) => {
    return { type };
  }),
  options: {
    disableNew: true,
  },
});
