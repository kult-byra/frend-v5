import { LayoutPanelTop } from "lucide-react";
import { defineType } from "sanity";

import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { pageBuilderField } from "@/schemas/generator-fields/page-builder.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const pageSchema = defineType({
  name: "page",
  title: "Side",
  type: "document",
  icon: LayoutPanelTop,
  groups: defaultGroups,
  options: {
    linkable: true,
  },
  fields: [
    stringField({
      name: "title",
      title: "Tittel",
      required: true,
      group: "key",
    }),
    slugField(),
    pageBuilderField(),
    metadataField(),
  ],
});
