import type { CardTone } from "@sanity/ui";
import type { LucideIcon } from "lucide-react";
import type { StringDefinition } from "sanity";
import { defineField } from "sanity";
import { InfoField } from "@/components/fields/info-field.component";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export type InfoFieldDefinition = Omit<FieldDef<StringDefinition>, "name"> & {
  name?: StringDefinition["name"];
  tone?: Exclude<CardTone, "primary" | "inherit" | "default">;
  icon?: LucideIcon;
};

export const infoField = (props: InfoFieldDefinition) => {
  return defineField({
    ...props,
    name: props.name ?? "info",
    type: "string",
    components: { field: () => <InfoField {...props} /> },
  });
};
