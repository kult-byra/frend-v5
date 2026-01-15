import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { Briefcase } from "lucide-react";
import { defineType } from "sanity";

export const jobOpeningSchema = defineType({
    name: "jobOpening",
    title: "Job opening",
    type: "document",
    icon: Briefcase,
    groups: defaultGroups,
    fields: [
        stringField({
            title: "Title",
            name: "title",
            group: "key",
        }),
        linksField({
            title: "Application link",
            name: "link",
            includeExternal: true,
            includeInternal: false,
            max: 1,
            group: "key",
        }),
        ...connectionsFields({ industry: false }),
    ],
}); 