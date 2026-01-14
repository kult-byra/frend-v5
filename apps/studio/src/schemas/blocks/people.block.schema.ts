import { Users } from "lucide-react";
import { referenceField } from "../generator-fields/reference.field";
import { defineBlock } from "../utils/define-block.util";

export const peopleBlockSchema = defineBlock({
    name: "people",
    title: "People",
    icon: Users,
    scope: ["pageBuilder", "portableText"],
    fields: [
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