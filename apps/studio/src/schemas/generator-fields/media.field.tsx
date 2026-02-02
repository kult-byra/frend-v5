import { Image, RectangleHorizontal, RectangleVertical, Square } from "lucide-react";
import { defineField, type FieldDefinition, type ObjectDefinition } from "sanity";
import { env } from "@/env";
import { gridOptionsField } from "@/schemas/generator-fields/grid-options.field";
import { illustrationField } from "@/schemas/generator-fields/illustration.field";
import { imageField } from "@/schemas/generator-fields/image.field";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";
import { validateVideoUrl, videoField } from "@/schemas/generator-fields/video.field";
import type { BlockDefinition } from "@/schemas/utils/define-block.util";
import type { IllustrationMode, IllustrationType } from "@/utils/illustrations.const";

export type MediaType = "image" | "video" | "illustration";

export type AspectRatioValue = "3:2" | "3:4" | "1:1";

export type MediaFieldOptions = Omit<FieldDef<ObjectDefinition>, "fields"> & {
  scope?: BlockDefinition["scope"];
  /** Enable image media type (default: true) */
  image?: boolean;
  /** Enable video media type (default: false) */
  video?: boolean;
  /** Enable illustration media type (default: false) */
  illustration?: boolean;
  /** Enable aspect ratio field (default: true) */
  aspectRatio?: boolean;
  /** Force a specific aspect ratio (hides the selector and locks to this value) */
  forcedAspectRatio?: AspectRatioValue;
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
    aspectRatio = true,
    forcedAspectRatio,
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

  // Hide mediaType selector when there's only one option
  const hasMultipleMediaTypes = mediaTypeOptions.length > 1;

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
      hidden: !hasMultipleMediaTypes,
      // Only require when multiple types are available; single-type fields treat undefined as default
      validation: hasMultipleMediaTypes ? (Rule) => Rule.required() : undefined,
    }),
  ];

  if (image) {
    fields.push(
      imageField({
        name: "image",
        title: "Image",
        // Show when mediaType is "image" OR undefined (default for new/migrated documents)
        hidden: ({ parent }) => parent?.mediaType != null && parent?.mediaType !== "image",
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

  if ((image || video) && (aspectRatio || forcedAspectRatio)) {
    if (forcedAspectRatio) {
      // Hidden field with forced value
      fields.push(
        defineField({
          name: "aspectRatio",
          title: "Aspect ratio",
          type: "string",
          hidden: true,
          initialValue: forcedAspectRatio,
          readOnly: true,
        }),
      );
    } else if (aspectRatio) {
      // Selectable aspect ratio
      fields.push(
        gridOptionsField({
          name: "aspectRatio",
          title: "Aspect ratio",
          // Show when mediaType is "image", "video", or undefined (default for new/migrated documents)
          hidden: ({ parent }) =>
            parent?.mediaType != null &&
            parent?.mediaType !== "image" &&
            parent?.mediaType !== "video",
          options: [
            { title: "3:2", value: "3:2", icon: RectangleHorizontal },
            { title: "3:4", value: "3:4", icon: RectangleVertical },
            { title: "1:1", value: "1:1", icon: Square },
          ],
          columns: 3,
          initialValue: "3:2",
        }),
      );
    }
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
    preview: {
      select: {
        mediaType: "mediaType",
        image: "image",
        illustration: "illustration",
        videoUrl: "videoUrl",
        aspectRatio: "aspectRatio",
      },
      prepare({ mediaType, image, illustration, videoUrl, aspectRatio }) {
        if (mediaType === "illustration" && illustration) {
          return {
            title: illustration,
            subtitle: "Illustration",
            media: (
              <img
                src={`${env.SANITY_STUDIO_FRONTEND_URL}/illustrations/${illustration}.svg`}
                alt={illustration}
                style={{ objectFit: "contain" }}
              />
            ),
          };
        }

        if (mediaType === "video" && videoUrl) {
          const subtitleParts = ["Video"];
          if (aspectRatio) subtitleParts.push(aspectRatio);
          return {
            title: "Video",
            subtitle: subtitleParts.join(" · "),
            description: videoUrl,
          };
        }

        // Default: image (Sanity handles image preview automatically)
        const subtitleParts = ["Image"];
        if (aspectRatio) subtitleParts.push(aspectRatio);
        if (image?.altText) subtitleParts.push(image.altText);
        return {
          title: image?.altText || "Image",
          subtitle: subtitleParts.join(" · "),
          media: image,
        };
      },
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
