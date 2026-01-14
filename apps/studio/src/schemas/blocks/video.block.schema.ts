import { Video } from "lucide-react";
import { stringField } from "../generator-fields/string.field";
import { defineBlock } from "../utils/define-block.util";

export const videoBlockSchema = defineBlock({
    name: "video",
    title: "Video",
    icon: Video,
    scope: ["portableText"],
    fields: [
        stringField({
            name: "url",
            title: "Video URL",
            description: "Use an URL from YouTube eller Vimeo.",
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Video",
            };
        },
            
    },
});