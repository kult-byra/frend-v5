import { Images } from "lucide-react";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { defineField } from "sanity";
import { figureField } from "../generator-fields/figure.field";

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
                figureField({
                    name: "image",
                    title: "Image",
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