import { Bot, Package } from "lucide-react";
import { defineField, defineType } from "sanity";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const subServiceSchema = defineType({
  name: "subService",
  title: "Service Subpage",
  type: "document",
  icon: Package,
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
      includeExcerpt: true,
      includeCoverImage: false,
    }),
    mediaField({
      title: "Illustration",
      name: "media",
      group: "key",
    }),
    referenceField({
      title: "Service",
      name: "service",
      to: [{ type: "service" }],
      group: "key",
      required: true,
    }),

    ...connectionsFields({ service: false }),

    //CONTENT
    portableTextWithBlocksField({
      includeHeadings: true,
      includeLists: true,
      group: "content",
    }),
    infoField({
      title: "Automatically generated content",
      description: "All related projects and articles are displayed automatically.",
      tone: "positive",
      icon: Bot,
      group: ["content"],
    }),
    metadataField(),
  ],
  preview: {
    select: {
      title: "title",
      media: "media.image",
    },
  },
});
