import { Video } from "lucide-react";
import { defineField, type StringDefinition } from "sanity";
import type { FieldDef } from "@/schemas/generator-fields/types/field.types";

export type VideoSource = "youtube" | "vimeo" | "direct";

export type VideoFieldOptions = FieldDef<StringDefinition> & {
  allowedSources?: VideoSource[];
};

const VIDEO_PATTERNS = {
  youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
  vimeo: /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/,
  direct: /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i,
} as const;

export const validateVideoUrl = (
  value: string,
  allowedSources?: VideoSource[],
): true | string => {
  if (!value || value.trim() === "") return true;

  const sources = allowedSources ?? (["youtube", "vimeo", "direct"] as VideoSource[]);
  const isValidUrl = /^https?:\/\/.+/.test(value);

  const matchesPattern = sources.some((source) => VIDEO_PATTERNS[source].test(value));

  if (!matchesPattern && !isValidUrl) {
    const sourceNames = sources.map((s) => {
      if (s === "youtube") return "YouTube";
      if (s === "vimeo") return "Vimeo";
      return "direct video file (MP4, WebM, etc.)";
    });
    return `Video URL must be a valid ${sourceNames.join(", ")} URL`;
  }

  return true;
};

export const videoField = (props: VideoFieldOptions) => {
  const {
    required,
    validation,
    title = "Video URL",
    allowedSources,
    ...rest
  } = props;

  return defineField({
    ...rest,
    title,
    type: "string",
    icon: Video,
    description:
      props.description ??
      "Enter a YouTube, Vimeo URL, or direct video file URL (MP4, WebM, etc.)",
    validation: validation
      ? validation
      : (Rule) => {
          const rules = [];

          if (required) {
            rules.push(Rule.required().error("Video URL is required"));
          }

          rules.push(
            Rule.custom((value: string | undefined) => {
              if (!value) return true;
              return validateVideoUrl(value, allowedSources);
            }),
          );

          return rules;
        },
  });
};
