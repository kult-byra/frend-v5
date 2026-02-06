import { Calendar } from "lucide-react";
import { defineField, defineType } from "sanity";
import { colorField } from "@/schemas/generator-fields/color.field";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { datetimeField } from "@/schemas/generator-fields/datetime.field";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

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
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    //KEY
    slugField({ isStatic: false }),
    stringField({
      name: "title",
      title: "Title",
      group: "key",
      required: true,
    }),
    mediaField({
      name: "media",
      title: "Media",
      description: "Cover image or video for the event",
      video: true,
      group: "key",
    }),
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
  preview: {
    select: {
      title: "title",
      media: "media.image.asset",
    },
    prepare({ title, media }) {
      return {
        title: title || "Untitled",
        media,
      };
    },
  },
});
