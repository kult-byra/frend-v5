import { Calendar, Newspaper } from "lucide-react";
import { defineField, defineType } from "sanity";

import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { datetimeField } from "@/schemas/generator-fields/datetime.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { colorField } from "@/schemas/generator-fields/color.field";

export const eventSchema = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: Calendar,
  groups: defaultGroups,
  options: {
    linkable: true,
  },
  fields: [
    //KEY
    ...heroFields(),
    defineField({
        title: "Time and date",
        name: "timeAndDate",
        type: "object",
        group: "key",
        fields: [
            datetimeField({
                name: "startTime",
                title: "Start time",
                validation: (Rule) => Rule.required().error("Start time is required"),
            }),
            datetimeField({
                name: "endTime",
                title: "End time",
            }),
        ],
    }),
    stringField({
        name: "location",
        title: "Location",
        group: "key",
        validation: (Rule) => Rule.required().error("Location is required"),
    }),
    stringField({
        name: "price",
        title: "Price",
        group: "key",
        validation: (Rule) => Rule.required().error("Price is required"),
    }),
    referenceField({
        title: "Signup form",
        name: "signupForm",
        to: [{ type: "hubspotForm" }],
        group: "key",
        validation: (Rule) => Rule.required().error("Signup form is required"),
    }),
    referenceField({
        title: "Event type",
        name: "eventType",
        to: [{ type: "eventType" }],
        group: "key",
        validation: (Rule) => Rule.required().error("Event type is required"),
    }),

    //CONNECTIONS
    ...connectionsFields(),

    //CONTENT
    stringField({
        title: "Layout",
        name: "layout",
        group: "content",
        options: {
            list: [
                { title: "Default", value: "default" },
                { title: "Submersive", value: "submersive" },
            ],
            layout: "radio",
            direction: "horizontal",
        },
        initialValue: "default",
        validation: (Rule) => Rule.required().error("Layout is required"),
    }),
    colorField({
        title: "Color",
        name: "color",
        group: "content",
        colors: ["white", "yellow"],
        initialValue: "white",
        hidden: ({ parent }) => parent?.layout === "default",
    }),
    portableTextField({
        title: "Description",
        name: "description",
        group: "content",
        noContent: true,
    }),
    portableTextWithBlocksField({
      group: "content",
      includeLists: true,
      includeHeadings: true,
    }),
    metadataField(),
  ],
});
