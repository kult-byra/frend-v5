import { Images } from "lucide-react";
import { defineField } from "sanity";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { imageFormatField } from "../generator-fields/image-format.field";
import { mediaField } from "../generator-fields/media.field";

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
            mediaField({
              name: "media",
              title: "Image/video",
              video: true,
            }),
            imageFormatField(),
          ],
          preview: {
            select: {
              mediaType: "media.mediaType",
              imageFormat: "imageFormat",
              image: "media.image",
            },
            prepare({ mediaType, imageFormat, image }) {
              const mediaTypeLabel =
                mediaType === "image" ? "Image" : mediaType === "video" ? "Video" : "Media";
              const formatLabel = imageFormat || "3:2";

              return {
                title: `${mediaTypeLabel} - ${formatLabel}`,
                media: image,
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
