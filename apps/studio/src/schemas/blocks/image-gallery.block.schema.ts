import { Image } from "lucide-react";
import { defineField } from "sanity";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { mediaField } from "../generator-fields/media.field";
import { imageFormatField } from "../generator-fields/image-format.field";

export const imageGalleryBlockSchema = defineBlock({
  name: "imageGallery",
  title: "Image gallery",
  icon: Image,
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
              const mediaTypeLabel = mediaType === "image" ? "Image" : mediaType === "video" ? "Video" : "Media";
              const formatLabel = imageFormat || "3:2";

              return {
                title: `${mediaTypeLabel} - ${formatLabel}`,
                media: image,
              };
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(3)
          .error("At least one image/video is required and at most three are allowed"),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Image gallery",
      };
    },
  },
});
