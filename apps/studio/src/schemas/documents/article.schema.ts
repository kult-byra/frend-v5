import { Newspaper } from "lucide-react";
import { defineType } from "sanity";

import { datetimeField } from "@/schemas/generator-fields/datetime.field";
import { figureField } from "@/schemas/generator-fields/figure.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

export const articleSchema = defineType({
  name: "article",
  title: "Artikkel",
  type: "document",
  icon: Newspaper,
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
    datetimeField({
      name: "publishDate",
      title: "Publiseringsdato",
      group: "key",
      required: true,
      initialValue: () => new Date().toISOString(),
    }),
    figureField({
      name: "coverImage",
      title: "Cover-bilde",
      group: "content",
    }),
    portableTextWithBlocksField({
      group: "content",
      includeLists: true,
      includeHeadings: true,
    }),
    metadataField(),
  ],
});
