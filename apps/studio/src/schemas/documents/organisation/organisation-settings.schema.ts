import { defineField, defineType } from "sanity";
import { defaultGroups } from "@/schemas/utils/default-groups.util";
import { stringField } from "@/schemas/generator-fields/string.field";
import { Phone } from "lucide-react";
import { linksField } from "@/schemas/generator-fields/links.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";

export const organisationSettingsSchema = defineType({
    name: "organisationSettings",
    title: "Organisation settings",
    type: "document",
    icon: Phone,
    options: {
        singleton: true,
    },
    fields: [
        stringField({
            title: "Name",
            name: "name",
            initialValue: "Org settings",
            description: "Only visible in Sanity",
            hidden: true,
        }),
        defineField({
            title: "Address",
            name: "address",
            type: "object",
            fields: [
                stringField({
                    title: "Street",
                    name: "street",
                }),
                stringField({
                    title: "City",
                    name: "city",
                }),
                stringField({
                    title: "Zip code",
                    name: "zipCode",
                }),
            ],
        }),
        stringField({
            title: "Phone number",
            name: "phoneNumber",
        }),
        stringField({
            title: "Email",
            name: "email",
        }),
        linksField({
            title: "Social media links",
            name: "socialMediaLinks",
            includeExternal: true,
            includeInternal: false,
        }),
        defineField({
            title: "Certifications",
            name: "certifications",
            type: "array",
            of: [
                defineField({
                    title: "Certification",
                    name: "certification",
                    type: "object",
                    fields: [
                        stringField({
                            title: "Title",
                            name: "title",
                        }),
                        referenceField({
                            title: "Logo",
                            name: "logo",
                            to: [{ type: "logo" }],
                        }),
                    ],
                }),
            ],
        }),
    ],
});