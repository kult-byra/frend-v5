import { LayoutPanelTop } from "lucide-react";
import { defineType } from "sanity";

import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { heroFields } from "../generator-fields/hero-fields.field";

export const pageSchema = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: LayoutPanelTop,
  groups: defaultGroups,
  options: {
    linkable: true,
  },
  fields: [
    ...heroFields({
      includeCoverImage: false,
      includeLinks: true,
      includeExcerpt: true,
    }),
    pageBuilderField({
      group: "content",
    }),
    metadataField(),
  ],
});
