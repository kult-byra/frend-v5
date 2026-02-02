import { Building } from "lucide-react";
import { defineField, defineType } from "sanity";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const clientSchema = defineType({
  name: "client",
  title: "Client",
  type: "document",
  icon: Building,
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
    stringField({
      name: "name",
      title: "Name",
      required: true,
      group: "key",
    }),
    referenceField({
      title: "Logo",
      name: "logo",
      to: [{ type: "logo" }],
      group: "key",
    }),
    portableTextField({
      title: "Description",
      name: "description",
      group: "content",
      noContent: true,
    }),
    ...connectionsFields(),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "logo.title",
    },
  },
});
