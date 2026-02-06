import { Sparkles } from "lucide-react";
import { imageField } from "../generator-fields/image.field";
import { linksField } from "../generator-fields/links.field";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { referenceField } from "../generator-fields/reference.field";
import { stringField } from "../generator-fields/string.field";
import { defineBlock } from "../utils/define-block.util";

export const contentTeaserBlockSchema = defineBlock({
  name: "contentTeaser",
  title: "Content Teaser",
  icon: Sparkles,
  scope: ["pageBuilder", "portableText"],
  fields: [
    stringField({
      name: "sourceType",
      title: "Source",
      description: "Choose whether to reference existing documents or fill in fields manually",
      options: {
        list: [
          { title: "Reference", value: "reference" },
          { title: "Manual", value: "manual" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "reference",
    }),

    // Reference mode: pick up to 2 documents
    referenceField({
      name: "documents",
      title: "Documents",
      description: "Select up to 2 content documents to feature",
      to: [
        { type: "knowledgeArticle" },
        { type: "caseStudy" },
        { type: "seminar" },
        { type: "eBook" },
        { type: "newsArticle" },
        { type: "event" },
      ],
      allowMultiple: true,
      max: 2,
      hidden: ({ parent }) => parent?.sourceType !== "reference",
    }),

    // Manual mode: single item
    stringField({
      name: "title",
      title: "Title",
      hidden: ({ parent }) => parent?.sourceType !== "manual",
    }),
    imageField({
      name: "image",
      title: "Image",
      hidden: ({ parent }) => parent?.sourceType !== "manual",
    }),
    portableTextField({
      name: "excerpt",
      title: "Excerpt",
      noContent: true,
      hidden: ({ parent }) => parent?.sourceType !== "manual",
    }),
    linksField({
      name: "links",
      title: "Links",
      description: "CTA buttons for the teaser",
      includeExternal: true,
      includeDownload: true,
      max: 2,
      hidden: ({ parent }) => parent?.sourceType !== "manual",
    }),
  ],
  preview: {
    select: {
      sourceType: "sourceType",
      manualTitle: "title",
      doc0Title: "documents.0.hero.title",
      doc0EventTitle: "documents.0.title",
    },
    prepare({ sourceType, manualTitle, doc0Title, doc0EventTitle }) {
      const subtitle =
        sourceType === "manual"
          ? (manualTitle ?? "Untitled")
          : (doc0Title ?? doc0EventTitle ?? "No document selected");
      return {
        title: "Content Teaser",
        subtitle: `${sourceType === "manual" ? "Manual" : "Reference"} · ${subtitle}`,
      };
    },
  },
});
