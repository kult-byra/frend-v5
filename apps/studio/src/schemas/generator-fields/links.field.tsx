import { Bot, Clock, Folder, Hand } from "lucide-react";
import type { ArrayDefinition, ArrayOfObjectsInputProps } from "sanity";
import { defineField } from "sanity";
import { LinksFieldInput } from "@/components/inputs/links-field-input.component";
import { downloadLinkObjectField } from "@/schemas/generator-fields/download-link-object.field";
import { externalLinkObjectField } from "@/schemas/generator-fields/external-link-object.field";
import { gridOptionsField } from "@/schemas/generator-fields/grid-options.field";
import { infoField } from "@/schemas/generator-fields/info.field";
import { internalLinkObjectField } from "@/schemas/generator-fields/internal-link-object.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";
import { imageField } from "./image.field";
import { referenceField } from "./reference.field";

type LinksFieldProps = Omit<FieldDef<ArrayDefinition>, "of" | "validation"> & {
  includeInternal?: boolean;
  includeLinkGroup?: boolean;
  includeExternal?: boolean;
  includeDownload?: boolean;
  includeCustomTitle?: boolean;
  includeDescription?: boolean;
  includeDescriptionInLinkGroup?: boolean;
  includeButtonVariant?: boolean;
  max?: number;
};

const customTitleField = defineField({
  name: "customTitle",
  title: "Custom title",
  type: "string",
});

const descriptionField = defineField({
  name: "description",
  title: "Description",
  type: "text",
  rows: 2,
});

const buttonVariantField = defineField({
  name: "buttonVariant",
  title: "Button style",
  type: "string",
  options: {
    list: [
      { title: "Primary (filled)", value: "primary" },
      { title: "Secondary (outline)", value: "secondary" },
    ],
    layout: "radio",
  },
  initialValue: "primary",
});

const internalLink = (props: LinksFieldProps) => {
  const { includeInternal, includeCustomTitle, includeDescription, includeButtonVariant } = props;

  if (!includeInternal) return null;

  const fields = [...internalLinkObjectField.fields];

  if (includeCustomTitle) {
    fields.push(customTitleField);
  }

  if (includeDescription) {
    fields.push(descriptionField);
  }

  if (includeButtonVariant) {
    fields.push(buttonVariantField);
  }

  return defineField({
    ...internalLinkObjectField,
    fields,
    preview: {
      select: {
        internalLinkTitle: "internalLink.title",
        internalLinkName: "internalLink.name",
        customTitle: "customTitle",
      },
      prepare({ internalLinkTitle, internalLinkName, customTitle }) {
        return {
          title: customTitle ?? internalLinkTitle ?? internalLinkName,
        };
      },
    },
  });
};

const externalLink = (props: LinksFieldProps) => {
  const { includeExternal, includeCustomTitle, includeDescription, includeButtonVariant } = props;

  if (!includeExternal) return null;

  const fields = [...externalLinkObjectField.fields];

  if (includeCustomTitle) {
    fields.push(customTitleField);
  }

  if (includeDescription) {
    fields.push(descriptionField);
  }

  if (includeButtonVariant) {
    fields.push(buttonVariantField);
  }

  return defineField({
    ...externalLinkObjectField,
    fields,
    preview: {
      select: {
        href: "href",
        customTitle: "customTitle",
      },
      prepare({ href, customTitle }) {
        return {
          title: customTitle ?? href,
        };
      },
    },
  });
};

const downloadLink = (props: LinksFieldProps) => {
  const { includeDownload, includeCustomTitle, includeDescription, includeButtonVariant } = props;

  if (!includeDownload) return null;

  const fields = [...downloadLinkObjectField.fields];

  if (includeCustomTitle) {
    fields.push(customTitleField);
  }

  if (includeDescription) {
    fields.push(descriptionField);
  }

  if (includeButtonVariant) {
    fields.push(buttonVariantField);
  }

  return defineField({
    ...downloadLinkObjectField,
    fields,
    preview: {
      select: {
        fileName: "file.asset.originalFilename",
        customTitle: "customTitle",
      },
      prepare({ fileName, customTitle }) {
        return {
          title: customTitle ?? fileName,
        };
      },
    },
  });
};

const linkGroup = (props: LinksFieldProps) => {
  const { includeLinkGroup, includeDescriptionInLinkGroup } = props;

  if (!includeLinkGroup) return null;

  return defineField({
    name: "linkGroup",
    title: "Lenkegruppe",
    type: "object",
    icon: Folder,
    fields: [
      stringField({
        name: "title",
        title: "Tittel",
        required: true,
      }),
      stringField({
        name: "menuType",
        title: "Menu type",
        description:
          "Use default for standard menu items, or other options for links to latest content.",
        options: {
          list: [
            { title: "Default", value: "default" },
            { title: "Knowledge", value: "knowledge" },
            { title: "News and events", value: "newsAndEvents" },
            { title: "Contact", value: "contact" },
          ],
          layout: "radio",
          direction: "horizontal",
        },
        required: true,
        initialValue: "default",
      }),
      defineField({
        title: "Links",
        name: "links",
        type: "object",
        hidden: ({ parent }) =>
          parent?.menuType === "contact" || parent?.menuType === "newsAndEvents",
        fields: [
          linksField({
            name: "mainLinks",
            title: "Main links",
            includeExternal: true,
          }),
          linksField({
            name: "secondaryLinks",
            title: "Secondary links",
            includeExternal: true,
          }),
        ],
      }),
      defineField({
        title: "Linkgroups",
        name: "linkGroups",
        type: "array",
        hidden: ({ parent }) => parent?.menuType !== "contact",
        of: [
          defineField({
            title: "Linkgroup",
            name: "linkGroup",
            type: "object",
            fields: [
              stringField({
                name: "title",
                title: "Tittel",
                required: true,
              }),
              linksField({
                name: "links",
                title: "Links",
                includeExternal: true,
              }),
            ],
            preview: {
              select: {
                title: "title",
              },
              prepare({ title }) {
                return {
                  title,
                };
              },
            },
          }),
        ],
      }),
      referenceField({
        title: "Contact form",
        name: "contactForm",
        to: [{ type: "hubspotForm" }],
        hidden: ({ parent }) => parent?.menuType !== "contact",
      }),
      imageField({
        title: "Image",
        name: "image",
        hidden: ({ parent }) => parent?.menuType !== "contact",
      }),

      // Highlighted documents for Knowledge menu
      defineField({
        name: "knowledgeHighlight",
        title: "Highlighted document",
        type: "object",
        fieldset: "highlightedDocuments",
        hidden: ({ parent }) => parent?.menuType !== "knowledge",
        fields: [
          gridOptionsField({
            name: "mode",
            title: "Display mode",
            description:
              "Choose how to select the highlighted document shown at the bottom of the menu",
            options: [
              {
                value: "latest",
                title: "Latest",
                description: "Automatically show the most recent knowledge document",
                icon: Clock,
              },
              {
                value: "manual",
                title: "Manual",
                description: "Manually select a specific document to highlight",
                icon: Hand,
              },
            ],
            initialValue: "latest",
          }),
          referenceField({
            name: "document",
            title: "Document",
            description: "Select a knowledge document to highlight",
            to: [
              { type: "knowledgeArticle" },
              { type: "caseStudy" },
              { type: "eBook" },
              { type: "seminar" },
            ],
            hidden: ({ parent }) => parent?.mode !== "manual",
          }),
        ],
      }),

      // Auto-generated content info for News and Events menu
      infoField({
        name: "newsEventsInfo",
        title: "Automatically generated content",
        description:
          "The latest news articles and upcoming events are displayed automatically in this menu.",
        tone: "positive",
        icon: Bot,
        hidden: ({ parent }) => parent?.menuType !== "newsAndEvents",
      }),
    ],
    fieldsets: [
      {
        name: "highlightedDocuments",
        title: "Highlighted document",
        description: "Configure the document shown at the bottom of the menu panel",
        options: { collapsible: true, collapsed: false },
      },
    ],
    preview: {
      select: {
        title: "title",
        menuType: "menuType",
      },
      prepare({ title, menuType }) {
        const menuTypeMap: Record<string, string> = {
          default: "Default",
          knowledge: "Knowledge",
          newsAndEvents: "News and events",
        };
        return {
          title,
          subtitle: menuType ? (menuTypeMap[menuType] ?? menuType) : "Default",
        };
      },
    },
  });
};

export const linksField = (props: LinksFieldProps) => {
  const { includeCustomTitle = true, includeInternal = true, options, required, max } = props;

  const realProps = {
    ...props,
    includeInternal,
    includeCustomTitle,
  };

  const linkTypes: ArrayDefinition["of"] = [
    internalLink(realProps),
    externalLink(realProps),
    downloadLink(realProps),
    linkGroup(realProps),
  ].filter(Boolean) as ArrayDefinition["of"];

  return defineField({
    ...props,
    type: "array",
    of: linkTypes,
    options: {
      ...options,
      required: required,
    },
    validation: (Rule) => {
      const rules = [];
      if (max) rules.push(Rule.max(max).error());
      if (required) rules.push(Rule.required().error());
      return rules;
    },
    components: {
      input: (props: ArrayOfObjectsInputProps) => <LinksFieldInput {...props} max={max} />,
    },
  });
};
