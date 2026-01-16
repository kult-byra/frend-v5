import { Images } from "lucide-react";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { defineField } from "sanity";
import { figureOrVideoField } from "../generator-fields/figure-or-video-field";

export const imageCarouselBlockSchema = defineBlock({
    name: "imageCarousel",
    title: "Image carousel",
    icon: Images,
    scope: ["pageBuilder", "portableText"],
    fields: [
        defineField({
            title: "Images",
            name: "images",
            type: "array",
            of: [
                figureOrVideoField({
                    name: "figureOrVideo",
                    title: "Image/video",
                    required: true,
                }),
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Image carousel",
            };
        },
    },
});