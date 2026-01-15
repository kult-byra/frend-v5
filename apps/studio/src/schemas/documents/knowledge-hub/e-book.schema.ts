import { Book, BookOpen } from "lucide-react";
import { defineType } from "sanity";

import { heroFields } from "@/schemas/generator-fields/hero-fields.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { linksField } from "@/schemas/generator-fields/links.field";

export const eBookSchema = defineType({
  name: "eBook",
  title: "E-book",
  type: "document",
  icon: BookOpen,
  groups: defaultGroups,
  options: {
    linkable: true,
  },
  fields: [
    ...heroFields(),
    linksField({
        title: "Upload file",
        name: "uploadFile",
        includeDownload: true,
        includeInternal: false,
        max: 1,
        group: "key",
    }),
    ...connectionsFields(),
    portableTextWithBlocksField({
      group: "content",
      includeLists: true,
      includeHeadings: true,
    }),
    metadataField(),
  ],
});
