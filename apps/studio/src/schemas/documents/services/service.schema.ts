import { Bot, Package } from "lucide-react";
import { defineType } from "sanity";
import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";

export const serviceSchema = defineType({
  name: "service",
  title: "Service",
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
      required: true,
    }),

    ...connectionsFields(),

    //CONTENT
    portableTextField({
      title: "Sub services description",
      name: "subServicesDescription",
      includeHeadings: true,
      includeLists: true,
      noContent: true,
      group: "content",
    }),
    portableTextWithBlocksField({
      includeHeadings: true,
      includeLists: true,
      group: "content",
    }),
    infoField({
      title: "Automatically generated content",
      description: "All related projects are displayed automatically.",
      tone: "positive",
      icon: Bot,
      group: ["content"],
    }),
    metadataField ()
  ],
});
