import { Image } from "lucide-react";
import { defineField, type ObjectDefinition } from "sanity";
import { figureField } from "@/schemas/generator-fields/figure.field";
import { imageFormatField } from "@/schemas/generator-fields/image-format.field";
import { stringField } from "@/schemas/generator-fields/string.field";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";
import type { BlockDefinition } from "@/schemas/utils/define-block.util";

export const figureOrVideoField = (
  props: Omit<FieldDef<ObjectDefinition>, "fields"> & {
    scope?: BlockDefinition["scope"];
  },
) => {
  const { required, validation, title = "Figure or Video" } = props;

  // Validation function to check if either figure or video URL is provided
  const validateFigureOrVideo = (Rule: any) => {
    const rules = [];
    
    if (required) {
      rules.push(
        Rule.custom((value: any) => {
          const hasFigure = value?.figure?.asset;
          const hasVideoUrl = value?.videoUrl && value.videoUrl.trim() !== "";
          
          if (!hasFigure && !hasVideoUrl) {
            return "Either an image or a video URL is required";
          }
          
          return true;
        }),
      );
    }

    // Validate video URL format if provided
    rules.push(
      Rule.custom((value: any) => {
        const videoUrl = value?.videoUrl;
        if (!videoUrl || videoUrl.trim() === "") return true;
        
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
        
        if (!youtubeRegex.test(videoUrl) && !vimeoRegex.test(videoUrl)) {
          return "Video URL must be a valid YouTube or Vimeo URL";
        }
        
        return true;
      }),
    );

    return rules;
  };

  return defineField({
    ...props,
    title,
    type: "object",
    icon: Image,
    fields: [
      defineField({
        name: "mediaType",
        title: "Media Type",
        type: "string",
        options: {
          list: [
            { title: "Image", value: "figure" },
            { title: "Video", value: "video" },
          ],
          layout: "radio",
          direction: "horizontal",
        },
        initialValue: "figure",
        validation: (Rule) => Rule.required(),
      }),
      figureField({
        name: "figure",
        title: "Image",
        hidden: ({ parent }) => parent?.mediaType !== "figure",
      }),
      stringField({
        name: "videoUrl",
        title: "Video URL",
        description: "Enter a YouTube or Vimeo URL",
        hidden: ({ parent }) => parent?.mediaType !== "video",
        validation: (Rule) => {
          return [
            Rule.custom((value: string | undefined, context: any) => {
              const parent = context.parent;
              if (parent?.mediaType === "video") {
                if (!value || value.trim() === "") {
                  return "Video URL is required when media type is video";
                }
                
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
                const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
                
                if (!youtubeRegex.test(value) && !vimeoRegex.test(value)) {
                  return "Video URL must be a valid YouTube or Vimeo URL";
                }
              }
              return true;
            }),
          ];
        },
      }),
    ],
    validation: validation ? validation : validateFigureOrVideo,
    options: {
      collapsible: true,
      collapsed: false,
    },
  });
};

