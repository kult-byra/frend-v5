import { Folder } from "lucide-react";
import type { ArrayDefinition, ArrayOfObjectsInputProps } from "sanity";
import { defineField } from "sanity";
import { LinksFieldInput } from "@/components/inputs/links-field-input.component";
import { downloadLinkObjectField } from "@/schemas/generator-fields/download-link-object.field";
import { externalLinkObjectField } from "@/schemas/generator-fields/external-link-object.field";
import { internalLinkObjectField } from "@/schemas/generator-fields/internal-link-object.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

type LinksFieldProps = Omit<FieldDef<ArrayDefinition>, "of" | "validation"> & {
  includeInternal?: boolean;
  includeLinkGroup?: boolean;
  includeExternal?: boolean;
  includeDownload?: boolean;
  includeCustomTitle?: boolean;
  includeDescription?: boolean;
  includeDescriptionInLinkGroup?: boolean;
  max?: number;
};

const customTitleField = defineField({
  name: "customTitle",
  title: "Egendefinert tittel",
  type: "string",
});

const descriptionField = defineField({
  name: "description",
  title: "Beskrivelse",
  type: "text",
  rows: 2,
});

const internalLink = (props: LinksFieldProps) => {
  const { includeInternal, includeCustomTitle, includeDescription } = props;

  if (!includeInternal) return null;

  const fields = [...internalLinkObjectField.fields];

  if (includeCustomTitle) {
    fields.push(customTitleField);
  }

  if (includeDescription) {
    fields.push(descriptionField);
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
  const { includeExternal, includeCustomTitle, includeDescription } = props;

  if (!includeExternal) return null;

  const fields = [...externalLinkObjectField.fields];

  if (includeCustomTitle) {
    fields.push(customTitleField);
  }

  if (includeDescription) {
    fields.push(descriptionField);
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
  const { includeDownload, includeCustomTitle, includeDescription } = props;

  if (!includeDownload) return null;

  const fields = [...downloadLinkObjectField.fields];

  if (includeCustomTitle) {
    fields.push(customTitleField);
  }

  if (includeDescription) {
    fields.push(descriptionField);
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
      linksField({
        name: "links",
        title: "Linker",
        includeExternal: true,
        includeDescription: includeDescriptionInLinkGroup,
        required: true,
      }),
    ],
    preview: {
      select: {
        title: "title",
        links: "links",
      },
      prepare({ title, links }) {
        return {
          title,
          subtitle: `${links?.length ?? 0} link${links?.length !== 1 ? "er" : ""}`,
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
