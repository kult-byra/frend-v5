import { Boxes } from "lucide-react";
import { defineField, defineType } from "sanity";

import { booleanField } from "@/schemas/generator-fields/boolean.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";

/**
 * Widget
 * A reusable content widget that can be embedded in heroes and other sections.
 * Supports multiple widget types: default (CTA), event, newsletter, and form.
 */
export const widgetSchema = defineType({
  name: "widget",
  title: "Widget",
  type: "object",
  icon: Boxes,
  fields: [
    // Enable widget toggle
    booleanField({
      name: "useWidget",
      title: "Use widget",
      description: "Enable to display a widget alongside the hero content",
      initialValue: false,
    }),

    // Type selector
    defineField({
      name: "widgetType",
      title: "Widget type",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Event", value: "event" },
          { title: "Newsletter", value: "newsletter" },
          { title: "Form", value: "form" },
        ],
        layout: "radio",
      },
      initialValue: "default",
      hidden: ({ parent }) => !parent?.useWidget,
    }),

    // DEFAULT widget fields
    stringField({
      name: "defaultTitle",
      title: "Title",
      hidden: ({ parent }) => !parent?.useWidget || parent?.widgetType !== "default",
    }),
    portableTextField({
      name: "defaultContent",
      title: "Content",
      description: "Brief description or call-to-action text",
      noContent: true,
      includeLists: true,
      includeHeadings: false,
      hidden: ({ parent }) => !parent?.useWidget || parent?.widgetType !== "default",
    }),
    linksField({
      name: "defaultLinks",
      title: "Buttons",
      includeExternal: true,
      includeDownload: true,
      max: 2,
      hidden: ({ parent }) => !parent?.useWidget || parent?.widgetType !== "default",
    }),

    // EVENT widget fields
    defineField({
      name: "eventSelectionMode",
      title: "Event selection",
      type: "string",
      options: {
        list: [
          { title: "Auto (earliest upcoming)", value: "auto" },
          { title: "Manual selection", value: "manual" },
        ],
        layout: "radio",
      },
      initialValue: "auto",
      hidden: ({ parent }) => !parent?.useWidget || parent?.widgetType !== "event",
    }),
    referenceField({
      name: "eventReference",
      title: "Event",
      description: "Select an event to display in the widget",
      to: [{ type: "event" }],
      hidden: ({ parent }) =>
        !parent?.useWidget ||
        parent?.widgetType !== "event" ||
        parent?.eventSelectionMode !== "manual",
    }),

    // NEWSLETTER widget fields - empty for now

    // FORM widget fields
    stringField({
      name: "formTitle",
      title: "Title",
      hidden: ({ parent }) => !parent?.useWidget || parent?.widgetType !== "form",
    }),
    referenceField({
      name: "formReference",
      title: "HubSpot Form",
      description: "Select a HubSpot form to display in the widget",
      to: [{ type: "hubspotForm" }],
      hidden: ({ parent }) => !parent?.useWidget || parent?.widgetType !== "form",
    }),
  ],
  preview: {
    select: {
      useWidget: "useWidget",
      widgetType: "widgetType",
      defaultTitle: "defaultTitle",
      formTitle: "formTitle",
      eventTitle: "eventReference.hero.mediaHero.title",
      eventSelectionMode: "eventSelectionMode",
    },
    prepare({ useWidget, widgetType, defaultTitle, formTitle, eventTitle, eventSelectionMode }) {
      if (!useWidget) {
        return {
          title: "Widget",
          subtitle: "Disabled",
        };
      }
      const typeLabels: Record<string, string> = {
        default: "Default",
        event: "Event",
        newsletter: "Newsletter",
        form: "Form",
      };

      let eventDisplayTitle = eventTitle;
      if (widgetType === "event" && eventSelectionMode === "auto") {
        eventDisplayTitle = "Earliest upcoming event";
      }

      const titles: Record<string, string | undefined> = {
        default: defaultTitle,
        event: eventDisplayTitle,
        newsletter: undefined,
        form: formTitle,
      };
      return {
        title: titles[widgetType] || "Widget",
        subtitle: typeLabels[widgetType] || widgetType,
      };
    },
  },
});
