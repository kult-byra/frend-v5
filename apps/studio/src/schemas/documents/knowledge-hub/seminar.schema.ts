import { Video } from "lucide-react";
import { defineField, defineType } from "sanity";

import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { booleanField } from "@/schemas/generator-fields/boolean.field";

export const seminarSchema = defineType({
  name: "seminar",
  title: "Seminar",
  type: "document",
  icon: Video,
  groups: defaultGroups,
  options: {
    linkable: true,
  },
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    ...heroFields({
      includeCoverImage: false,
      includeExcerpt: true,
    }),
    referenceField({
      title: "Client",
      name: "client",
      to: [{ type: "client" }],
      group: "key",
    }),
    referenceField({
      title: "Signup form",
      name: "signupForm",
      to: [{ type: "hubspotForm" }],
      group: "key",
      validation: (Rule) => Rule.required().error("Signup form is required"),
  }),
  booleanField({
    title: "Is flagship model seminar",
    name: "isFlagshipModelSeminar",
    group: "key",
    initialValue: false,
  }),
    ...connectionsFields(),
    //TODO: Fix the full seminar stuff
    portableTextWithBlocksField({
      group: "content",
      includeLists: true,
      includeHeadings: true,
    }),
    metadataField(),
  ],
});
