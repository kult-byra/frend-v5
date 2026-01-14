import { LayoutGrid } from "lucide-react";
import { defineBlock } from "../utils/define-block.util";
import { referenceField } from "../generator-fields/reference.field";

export const cardsBlockSchema = defineBlock({
    name: "cards",
    title: "Cards",
    icon: LayoutGrid,
    scope: ["portableText", "pageBuilder"],
    fields: [
        referenceField({
            title: "Cards",
            name: "cards",
            to: [
                { type: "newsArticle" },
                { type: "service" },
                { type: "subService" },
                //TODO: Add other types here
                //TODO: Consider wether to choose card layout??
            ],
            allowMultiple: true,
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Cards",
            };
        },
    },
})