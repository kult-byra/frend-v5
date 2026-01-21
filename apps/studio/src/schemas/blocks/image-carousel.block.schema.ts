import { Images } from "lucide-react";
import { defineField } from "sanity";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { figureOrVideoField } from "../generator-fields/figure-or-video-field";
import { imageFormatField } from "../generator-fields/image-format.field";

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
        defineField({
          title: "Image/video",
          name: "figureOrVideo",
          type: "object",
          fields: [
            figureOrVideoField({
              name: "figureOrVideo",
              title: "Image/video",
            }),
            imageFormatField(),
          ],
          preview: {
            select: {
              mediaType: "figureOrVideo.mediaType",
              imageFormat: "imageFormat",
              figure: "figureOrVideo.figure",
            },
            prepare({ mediaType, imageFormat, figure }) {
              const mediaTypeLabel =
                mediaType === "figure" ? "Image" : mediaType === "video" ? "Video" : "Media";
              const formatLabel = imageFormat || "3:2";

              return {
                title: `${mediaTypeLabel} - ${formatLabel}`,
                media: figure,
              };
            },
          },
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
