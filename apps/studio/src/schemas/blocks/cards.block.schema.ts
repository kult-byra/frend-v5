import { Building, Calendar, LayoutGrid, Newspaper, Package, Settings, Star } from "lucide-react";
import { booleanField } from "@/schemas/generator-fields/boolean.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { defineBlock } from "../utils/define-block.util";

const contentTypeOptions = [
  { title: "Services", value: "services", icon: Package },
  { title: "News articles", value: "newsArticle", icon: Newspaper },
  { title: "Case studies", value: "caseStudy", icon: Star },
  { title: "Events", value: "event", icon: Calendar },
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
    // News articles
    referenceField({
      name: "manualNewsArticleDocuments",
      title: "Select news articles",
      description: "Select which news articles should be displayed in the cards.",
      allowMultiple: true,
      to: [{ type: "newsArticle" }],
      hidden: ({ parent }) =>
        parent.manualSelection !== true || parent.contentType !== "newsArticle",
    }),
    // Case studies
    referenceField({
      name: "manualCaseStudyDocuments",
      title: "Select case studies",
      description: "Select which case studies should be displayed in the cards.",
      allowMultiple: true,
      to: [{ type: "caseStudy" }],
      hidden: ({ parent }) => parent.manualSelection !== true || parent.contentType !== "caseStudy",
    }),
    // Events
    referenceField({
      name: "manualEventDocuments",
      title: "Select events",
      description: "Select which events should be displayed in the cards.",
      allowMultiple: true,
      to: [{ type: "event" }],
      hidden: ({ parent }) => parent.manualSelection !== true || parent.contentType !== "event",
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
