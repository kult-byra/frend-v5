import { Users } from "lucide-react";
import { referenceField } from "../generator-fields/reference.field";
import { defineBlock } from "../utils/define-block.util";
import { stringField } from "../generator-fields/string.field";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";

export const peopleBlockSchema = defineBlock({
    name: "people",
    title: "People",
    icon: Users,
    scope: ["pageBuilder", "portableText"],
    fields: [
        stringField({
            title: "Title",
            name: "title",
        }),
        portableTextField({
            name: "excerpt",
            title: "Excerpt",
            noContent: true,
        }),
        referenceField({
            title: "People",
            name: "people",
            to: [{ type: "person" }],
            allowMultiple: true,
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "People",
            };
        },
    },
})