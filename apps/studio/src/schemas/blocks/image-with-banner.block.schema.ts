import { ImagePlus } from "lucide-react";
import { defineBlock } from "../utils/define-block.util";
import { figureField } from "../generator-fields/figure.field";
import { stringField } from "../generator-fields/string.field";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { linksField } from "../generator-fields/links.field";

export const imageWithBannerBlockSchema = defineBlock({
    name: "imageWithBanner",
    title: "Image with banner",
    icon: ImagePlus,
    scope: ["portableText", "pageBuilder"],
    fields: [
        stringField({
            name: "heading",
            title: "Heading",
            required: true,
        }),
        portableTextField({
            name: "text",
            title: "Text",
            noContent: true,
            includeLists: true,
        }),
        linksField({
            title: "Link",
            name: "link",
            includeExternal: true,
            includeDownload: true,
            max: 1,
        }),
        figureField({
            name: "image",
            title: "Image",
            required: true,
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Image with banner",
            };
        },
    },
});