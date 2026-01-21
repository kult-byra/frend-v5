import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";
import { colorField } from "@/schemas/generator-fields/color.field";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const caseStudySchema = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  icon: Star,
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
    ...heroFields(),
    referenceField({
      title: "Client",
      name: "client",
      to: [{ type: "client" }],
      group: "key",
    }),
    colorField({
      title: "Color",
      name: "color",
      group: "key",
      colors: ["white", "navy", "orange"],
      initialValue: "white",
    }),
    ...connectionsFields(),
    portableTextField({
      title: "Summary",
      name: "summary",
      group: "content",
      includeLists: true,
      noContent: true,
    }),
    defineField({
      title: "Key results",
      name: "keyResults",
      type: "array",
      group: "content",
      of: [
        stringField({
          name: "listItem",
          title: "List item",
          required: true,
        }),
      ],
    }),
    pageBuilderField({
      group: "content",
    }),
    metadataField(),
  ],
});
