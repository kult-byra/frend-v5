import { Form } from "lucide-react";
import { referenceField } from "../generator-fields/reference.field";
import { defineBlock } from "../utils/define-block.util";

export const formBlockSchema = defineBlock({
    name: "form",
    title: "Form",
    icon: Form,
    scope: ["portableText"],
    fields: [
        referenceField({
            title: "Form",
            name: "form",
            to: [{ type: "hubspotForm" }],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Form",
            };
        },
    },
})