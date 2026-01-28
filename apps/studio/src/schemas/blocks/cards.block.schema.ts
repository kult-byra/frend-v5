import { BookOpen, Building, Calendar, LayoutGrid, Package, Settings } from "lucide-react";
import { defineField } from "sanity";
import { booleanField } from "@/schemas/generator-fields/boolean.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { defineBlock } from "../utils/define-block.util";

const contentTypeOptions = [
  { title: "Services", value: "services", icon: Package },
  { title: "Knowledge", value: "knowledge", icon: BookOpen },
  { title: "News & Events", value: "newsEvents", icon: Calendar },
  { title: "Clients", value: "client", icon: Building },
];

export const cardsBlockSchema = defineBlock({
  name: "cards",
  title: "Cards",
  icon: LayoutGrid,
  scope: ["pageBuilder"],
  fields: [
    stringField({
      name: "heading",
      title: "Heading",
    }),
    portableTextField({
      title: "Excerpt",
      name: "excerpt",
      noContent: true,
    }),
    stringField({
      name: "contentType",
      title: "What content type should be displayed?",
      required: true,
      options: {
        list: contentTypeOptions.map((option) => ({
          title: option.title,
          value: option.value,
        })),
        layout: "radio",
      },
      initialValue: "services",
    }),
    // Knowledge types checkbox filter
    defineField({
      name: "knowledgeTypes",
      title: "Knowledge types to include",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Articles", value: "knowledgeArticle" },
          { title: "Case Studies", value: "caseStudy" },
          { title: "Seminars", value: "seminar" },
          { title: "E-books", value: "eBook" },
        ],
        layout: "grid",
      },
      initialValue: ["knowledgeArticle", "caseStudy", "seminar", "eBook"],
      hidden: ({ parent }) => parent?.contentType !== "knowledge",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { contentType?: string } | undefined;
          if (parent?.contentType === "knowledge" && (!value || value.length === 0)) {
            return "Select at least one knowledge type";
          }
          return true;
        }),
    }),
    // News & Events types checkbox filter
    defineField({
      name: "newsEventTypes",
      title: "News & Events types to include",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "News Articles", value: "newsArticle" },
          { title: "Events", value: "event" },
        ],
        layout: "grid",
      },
      initialValue: ["newsArticle", "event"],
      hidden: ({ parent }) => parent?.contentType !== "newsEvents",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { contentType?: string } | undefined;
          if (parent?.contentType === "newsEvents" && (!value || value.length === 0)) {
            return "Select at least one news/event type";
          }
          return true;
        }),
    }),
    // Links (shown for all content types)
    linksField({
      name: "links",
      title: "Links",
      description: "Add links to relevant pages (e.g., archive pages, external resources).",
      includeExternal: true,
      includeButtonVariant: true,
      max: 2,
    }),
    booleanField({
      name: "manualSelection",
      title: "Manual selection",
      description:
        "Check to manually select specific documents. If not checked, the last published documents will be displayed automatically.",
      initialValue: false,
    }),
    infoField({
      name: "automaticInfo",
      title: "Automatic content",
      description:
        "The last published documents of the selected type will be displayed automatically.",
      icon: Settings,
      tone: "positive",
      hidden: ({ parent }) => parent.manualSelection !== false,
    }),
    infoField({
      name: "manualInfo",
      title: "Manual selection",
      description: "Select specific documents manually from the selected document type.",
      icon: Settings,
      tone: "caution",
      hidden: ({ parent }) => parent.manualSelection !== true,
    }),
    // Services
    referenceField({
      name: "manualServiceDocuments",
      title: "Select services",
      description: "Select which services or sub-services should be displayed in the cards.",
      allowMultiple: true,
      to: [{ type: "service" }, { type: "subService" }],
      hidden: ({ parent }) => parent.manualSelection !== true || parent.contentType !== "services",
    }),
    // Knowledge items (articles, case studies, seminars, e-books)
    referenceField({
      name: "manualKnowledgeDocuments",
      title: "Select knowledge items",
      description: "Select which knowledge items should be displayed in the cards.",
      allowMultiple: true,
      to: [
        { type: "knowledgeArticle" },
        { type: "caseStudy" },
        { type: "seminar" },
        { type: "eBook" },
      ],
      hidden: ({ parent }) => parent.manualSelection !== true || parent.contentType !== "knowledge",
    }),
    // News & Events items
    referenceField({
      name: "manualNewsEventDocuments",
      title: "Select news & events",
      description: "Select which news articles or events should be displayed in the cards.",
      allowMultiple: true,
      to: [{ type: "newsArticle" }, { type: "event" }],
      hidden: ({ parent }) =>
        parent.manualSelection !== true || parent.contentType !== "newsEvents",
    }),
    // Clients
    referenceField({
      name: "manualClientDocuments",
      title: "Select clients",
      description: "Select which clients should be displayed in the cards.",
      allowMultiple: true,
      to: [{ type: "client" }],
      hidden: ({ parent }) => parent.manualSelection !== true || parent.contentType !== "client",
    }),
  ],
  preview: {
    select: {
      contentType: "contentType",
    },
    prepare(selection) {
      const contentTypeOption = contentTypeOptions.find(
        (option) => option.value === selection.contentType,
      );
      return {
        title: "Cards",
        subtitle: contentTypeOption?.title ?? "",
      };
    },
  },
});
