import { BookOpen } from "lucide-react";
import { defineField, defineType } from "sanity";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { articleHeroField } from "@/schemas/generator-fields/hero.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { defaultGroups } from "@/schemas/utils/default-groups.util";

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
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    slugField({ isStatic: false }),
    articleHeroField({
      group: "key",
      useExcerpt: true,
      useMedia: 1,
    }),
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
  preview: {
    select: {
      title: "hero.title",
      media: "hero.media.0.image.asset",
    },
    prepare({ title, media }) {
      return {
        title: title || "Untitled",
        media,
      };
    },
  },
});
