import { Building } from "lucide-react";
import { defineType } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";

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
});
