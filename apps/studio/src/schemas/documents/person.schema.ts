import { User } from "lucide-react";
import { defineField, defineType } from "sanity";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { metadataField } from "@/schemas/generator-fields/metadata.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { sharedDocumentInfoField } from "@/schemas/generator-fields/shared-document-info.field";
import { slugField } from "@/schemas/generator-fields/slug.field";
import { stringField } from "@/schemas/generator-fields/string.field";

export const personSchema = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: User,
  options: {
    linkable: true,
  },
  groups: [
    { name: "no", title: "Norsk 🇧🇻", default: true },
    { name: "en", title: "English 🇬🇧" },
    { name: "seo", title: "SEO" },
  ],
  fieldsets: [
    {
      name: "contactInfo",
      title: "Contact Info",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    sharedDocumentInfoField(),
    slugField({
      source: "name",
      group: false,
    }),
    stringField({
      name: "name",
      title: "Name",
      required: true,
    }),
    mediaField({
      name: "media",
      title: "Media",
      image: true,
    }),

    // Norwegian
    stringField({
      name: "role_no",
      title: "Role",
      group: "no",
      required: true,
    }),
    stringField({
      name: "excerpt_no",
      title: "Short description",
      group: "no",
      description: "Brief bio shown in cards and hero (1-2 sentences)",
    }),
    portableTextField({
      name: "content_no",
      title: "About",
      group: "no",
      noContent: true,
      includeLists: true,
      includeHeadings: true,
      description: "Full bio/about text for the person page",
    }),

    // English
    stringField({
      name: "role_en",
      title: "Role",
      group: "en",
      required: true,
    }),
    stringField({
      name: "excerpt_en",
      title: "Short description",
      group: "en",
      description: "Brief bio shown in cards and hero (1-2 sentences)",
    }),
    portableTextField({
      name: "content_en",
      title: "About",
      group: "en",
      noContent: true,
      includeLists: true,
      includeHeadings: true,
      description: "Full bio/about text for the person page",
    }),

    // Contact info (language-independent)
    stringField({
      name: "phone",
      title: "Phone",
      fieldset: "contactInfo",
    }),
    stringField({
      name: "email",
      title: "Email",
      fieldset: "contactInfo",
    }),
    defineField({
      name: "profileLinks",
      title: "Profile Links",
      description: "External profile links (LinkedIn, GitHub, etc.)",
      type: "array",
      fieldset: "contactInfo",
      of: [
        {
          type: "object",
          name: "profileLink",
          title: "Profile Link",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ["https", "http"],
                }),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "url",
            },
          },
        },
      ],
    }),

    // Expertise - references to services, subservices, and technologies
    referenceField({
      name: "expertise",
      title: "Expertise",
      description: "Areas of expertise (services, subservices, or technologies)",
      to: [{ type: "service" }, { type: "subService" }, { type: "technology" }],
      allowMultiple: true,
    }),

    defineField({
      title: "Works outside of Frend",
      name: "externalPerson",
      type: "boolean",
      initialValue: false,
    }),
    stringField({
      title: "Company",
      name: "company",
      hidden: ({ parent }) => parent?.externalPerson === false,
    }),

    // SEO
    metadataField({ group: "seo" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role_no",
      media: "media.image",
      externalPerson: "externalPerson",
    },
    prepare({ title, subtitle, media, externalPerson }) {
      return {
        title: title || "Untitled",
        subtitle: externalPerson ? `${subtitle} (External)` : subtitle,
        media,
      };
    },
  },
});
