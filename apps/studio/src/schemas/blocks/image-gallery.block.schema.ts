import { Image } from "lucide-react";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { defineField } from "sanity";
import { figureOrVideoField } from "../generator-fields/figure-or-video-field";
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
              const mediaTypeLabel = mediaType === "figure" ? "Image" : mediaType === "video" ? "Video" : "Media";
              const formatLabel = imageFormat || "3:2";
              
              return {
                title: `${mediaTypeLabel} - ${formatLabel}`,
                media: figure,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(3).error("At least one image/video is required and at most three are allowed"),
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