import { Image } from "lucide-react";
import { defineField, type FieldDefinition, type ObjectDefinition } from "sanity";

import type { FieldDef } from "@/schemas/generator-fields/types/field.types";
import type { BlockDefinition } from "@/schemas/utils/define-block.util";
import type { IllustrationMode, IllustrationType } from "@/utils/illustrations.const";

import { imageField } from "@/schemas/generator-fields/image.field";
import { illustrationField } from "@/schemas/generator-fields/illustration.field";
import { validateVideoUrl, videoField } from "@/schemas/generator-fields/video.field";

export type MediaType = "image" | "video" | "illustration";

export type MediaFieldOptions = Omit<FieldDef<ObjectDefinition>, "fields"> & {
  scope?: BlockDefinition["scope"];
  /** Enable image media type (default: true) */
  image?: boolean;
  /** Enable video media type (default: false) */
  video?: boolean;
  /** Enable illustration media type (default: false) */
  illustration?: boolean;
  /** Illustration-specific options */
  illustrationOptions?: {
    filterMode?: IllustrationMode;
    filterType?: IllustrationType;
  };
};

type MediaTypeOption = {
  title: string;
  value: MediaType;
};

const buildMediaTypeOptions = (options: {
  image: boolean;
  video: boolean;
  illustration: boolean;
}): MediaTypeOption[] => {
  const result: MediaTypeOption[] = [];

  if (options.image) {
    result.push({ title: "Image", value: "image" });
  }
  if (options.video) {
    result.push({ title: "Video", value: "video" });
  }
  if (options.illustration) {
    result.push({ title: "Illustration", value: "illustration" });
  }

  return result;
};

const getInitialMediaType = (options: {
  image: boolean;
  video: boolean;
  illustration: boolean;
}): MediaType => {
  if (options.image) return "image";
  if (options.video) return "video";
  if (options.illustration) return "illustration";
  return "image";
};

export const mediaField = (props: MediaFieldOptions) => {
  const {
    required,
    validation,
    title = "Media",
    image = true,
    video = false,
    illustration = false,
    illustrationOptions,
    ...rest
  } = props;

  const mediaTypeOptions = buildMediaTypeOptions({ image, video, illustration });
  const initialMediaType = getInitialMediaType({ image, video, illustration });

  // Build validation for the composite field
  const validateMedia = (Rule: any) => {
    const rules = [];

    if (required) {
      rules.push(
        Rule.custom((value: any) => {
          const mediaType = value?.mediaType;

          if (mediaType === "image") {
            if (!value?.image?.asset) {
              return "An image is required";
            }
          } else if (mediaType === "video") {
            if (!value?.videoUrl || value.videoUrl.trim() === "") {
              return "A video URL is required";
            }
          } else if (mediaType === "illustration") {
            if (!value?.illustration) {
              return "An illustration is required";
            }
          } else {
            return "Please select a media type";
          }

          return true;
        }),
      );
    }

    // Validate video URL format if provided
    if (video) {
      rules.push(
        Rule.custom((value: any) => {
          if (value?.mediaType !== "video") return true;
          const videoUrl = value?.videoUrl;
          if (!videoUrl || videoUrl.trim() === "") return true;
          return validateVideoUrl(videoUrl);
        }),
      );
    }

    return rules;
  };

  // Build fields array based on enabled media types
  const fields: FieldDefinition[] = [
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: mediaTypeOptions,
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: initialMediaType,
      validation: (Rule) => Rule.required(),
    }),
  ];

  if (image) {
    fields.push(
      imageField({
        name: "image",
        title: "Image",
        hidden: ({ parent }) => parent?.mediaType !== "image",
      }),
    );
  }

  if (video) {
    fields.push(
      videoField({
        name: "videoUrl",
        title: "Video URL",
        hidden: ({ parent }) => parent?.mediaType !== "video",
      }),
    );
  }

  if (illustration) {
    fields.push(
      illustrationField({
        name: "illustration",
        title: "Illustration",
        hidden: ({ parent }) => parent?.mediaType !== "illustration",
        filterMode: illustrationOptions?.filterMode,
        filterType: illustrationOptions?.filterType,
      }),
    );
  }

  return defineField({
    ...rest,
    title,
    type: "object",
    icon: Image,
    fields,
    validation: validation ?? validateMedia,
    options: {
      collapsible: true,
      collapsed: false,
    },
  });
};

/** @deprecated Use mediaField({ image: true, video: true }) instead */
export const figureOrVideoField = (
  props: Omit<MediaFieldOptions, "image" | "video" | "illustration">,
) => {
  return mediaField({
    ...props,
    image: true,
    video: true,
    illustration: false,
  });
};
