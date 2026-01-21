import { Bot, Package } from "lucide-react";
import { defineType } from "sanity";
import { env } from "@/env";
import { connectionsFields } from "@/schemas/generator-fields/connections-fields.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { portableTextWithBlocksField } from "@/schemas/generator-fields/portable-text/portable-text-with-blocks.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";

export const subServiceSchema = defineType({
  name: "subService",
  title: "Service Subpage",
  type: "document",
  icon: Package,
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
    { name: "shared", title: "Shared" },
    { name: "connections", title: "Connections" },
    { name: "meta", title: "SEO & metadata" },
  ],
  options: {
    linkable: true,
  },
  fields: [
    // ===== NORWEGIAN =====
    stringField({
      name: "title_no",
      title: "Title",
      required: true,
      group: "no",
    }),
    slugField({
      name: "slug_no",
      title: "Slug",
      source: "title_no",
      group: "no",
    }),
    portableTextField({
      title: "Excerpt",
      name: "excerpt_no",
      group: "no",
      noContent: true,
      includeLists: true,
    }),
    portableTextWithBlocksField({
      title: "Content",
      name: "content_no",
      includeHeadings: true,
      includeLists: true,
      noContent: true,
      group: "no",
    }),
    metadataField({ name: "metadata_no", group: "no" }),

    // ===== ENGLISH =====
    stringField({
      name: "title_en",
      title: "Title",
      group: "en",
    }),
    slugField({
      name: "slug_en",
      title: "Slug",
      source: "title_en",
      group: "en",
    }),
    portableTextField({
      title: "Excerpt",
      name: "excerpt_en",
      group: "en",
      noContent: true,
      includeLists: true,
    }),
    portableTextWithBlocksField({
      title: "Content",
      name: "content_en",
      includeHeadings: true,
      includeLists: true,
      noContent: true,
      group: "en",
    }),
    metadataField({ name: "metadata_en", group: "en" }),

    // ===== SHARED (language-independent) =====
    mediaField({
      title: "Illustration",
      name: "media",
      group: "shared",
    }),
    referenceField({
      title: "Service",
      name: "service",
      to: [{ type: "service" }],
      group: "shared",
      required: true,
    }),

    ...connectionsFields({ service: false }),

    infoField({
      title: "Automatically generated content",
      description: "All related projects and articles are displayed automatically.",
      tone: "positive",
      icon: Bot,
      group: ["shared"],
    }),
  ],
  preview: {
    select: {
      title: "title_no",
      mediaType: "media.mediaType",
      image: "media.image",
      illustration: "media.illustration",
    },
    prepare({ title, mediaType, image, illustration }) {
      if (mediaType === "illustration" && illustration) {
        return {
          title,
          media: (
            <img
              src={`${env.SANITY_STUDIO_FRONTEND_URL}/illustrations/${illustration}.svg`}
              alt={illustration}
              style={{ objectFit: "contain" }}
            />
          ),
        };
      }
      return {
        title,
        media: image,
      };
    },
  },
});
