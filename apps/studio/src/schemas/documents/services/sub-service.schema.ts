import { Bot, Package } from "lucide-react";
import { defineType } from "sanity";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";

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
    ...heroFields({
      includeExcerpt: true,
      includeCoverImage: false,
    }),
    referenceField({
      title: "Illustration",
      name: "illustration",
      to: [{ type: "isometricIllustration" }],
      group: "key",
    }),
    referenceField({
      title: "Service",
      name: "service",
      to: [{ type: "service" }],
      group: "key",
      required: true,
    }),

    ...connectionsFields({service: false}),

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
    metadataField ()
  ],
  preview: {
    select: {
      title: "title",
      media: "illustration.illustration",
    },
  },
});
