import {
  Columns2,
  GalleryHorizontalEnd,
  Grid2x2,
  Image,
  LayoutGrid,
  PanelLeft,
  Square,
} from "lucide-react";
import { defineField } from "sanity";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { gridOptionsField } from "../generator-fields/grid-options.field";
import { mediaField } from "../generator-fields/media.field";

// Media limits per layout type: { min, max }
const MEDIA_LIMITS = {
  single: { min: 1, max: 1 },
  grid: { min: 1, max: 6 },
  carousel: { min: 2, max: 99 },
  mediaFull: { min: 1, max: 3 },
  dynamic: { min: 1, max: 3 },
  doubleStickyFull: { min: 2, max: 2 },
  carouselFull: { min: 3, max: 99 },
};

// Helper to check if grid type is selected
const isGridType = ({
  parent,
}: {
  parent?: { options?: { width?: string; galleryTypeHalf?: string } };
}) => {
  const options = parent?.options;
  const isFullWidth = options?.width === "fullWidth";
  const galleryType = options?.galleryTypeHalf || "grid";
  return !isFullWidth && galleryType === "grid";
};

export const mediaGalleryBlockSchema = defineBlock({
  name: "mediaGallery",
  title: "Media Gallery",
  icon: Image,
  scope: ["pageBuilder", "portableText"],
  fields: [
    // Title field - only visible for grid type
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional headline above the media grid",
      hidden: ({ parent }) => !isGridType({ parent }),
    }),
    // Intro field - only visible for grid type
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Optional intro text below the title",
      hidden: ({ parent }) => !isGridType({ parent }),
    }),
    defineField({
      title: "Media",
      name: "media",
      type: "array",
      of: [mediaField({ name: "media", title: "Image/video", video: true })],
      validation: (Rule) =>
        Rule.custom((media, context) => {
          const parent = context.parent as { options?: Record<string, string> } | undefined;
          const options = parent?.options;
          const isFullWidth = options?.width === "fullWidth";
          const type = isFullWidth
            ? options?.galleryTypeFull || "mediaFull"
            : options?.galleryTypeHalf || "grid";

          const { min, max } = MEDIA_LIMITS[type as keyof typeof MEDIA_LIMITS] || {
            min: 1,
            max: 99,
          };

          if (!media || media.length === 0) return "At least one media item is required";
          if (media.length < min) return `This layout requires at least ${min} media item(s)`;
          if (media.length > max) return `This layout allows at most ${max} media item(s)`;
          return true;
        }),
    }),
  ],
  optionFields: [
    // Half width gallery types
    gridOptionsField({
      name: "galleryTypeHalf",
      title: "Gallery Type",
      description: "Choose how media is displayed. More options available in full width.",
      columns: 3,
      initialValue: "grid",
      hidden: ({ parent }) => parent?.width === "fullWidth",
      options: [
        { value: "single", title: "Single", description: "Single media item", icon: Square },
        {
          value: "grid",
          title: "Grid",
          description: "Uniform grid layout (up to 6 items)",
          icon: Grid2x2,
        },
        {
          value: "carousel",
          title: "Carousel",
          description: "Scrollable carousel (2+ items)",
          icon: GalleryHorizontalEnd,
        },
      ],
    }),

    // Full width gallery types
    gridOptionsField({
      name: "galleryTypeFull",
      title: "Gallery Type",
      description: "Choose how media is displayed. More options available in half width.",
      columns: 3,
      initialValue: "mediaFull",
      hidden: ({ parent }) => parent?.width !== "fullWidth",
      options: [
        {
          value: "mediaFull",
          title: "Media Full",
          description: "Up to 3 items in equal width columns",
          icon: Columns2,
        },
        {
          value: "dynamic",
          title: "Dynamic",
          description: "Up to 3 items in staggered floating layout",
          icon: LayoutGrid,
        },
        {
          value: "doubleStickyFull",
          title: "Double Sticky",
          description: "One 3:2 and one 3:4 media, 3:2 is sticky (order follows array)",
          icon: PanelLeft,
        },
        {
          value: "carouselFull",
          title: "Carousel",
          description: "Looping carousel with swipe (3+ items)",
          icon: GalleryHorizontalEnd,
        },
      ],
    }),
  ],
  preview: {
    select: {
      media: "media",
      width: "options.width",
      galleryTypeHalf: "options.galleryTypeHalf",
      galleryTypeFull: "options.galleryTypeFull",
    },
    prepare: ({ media, width, galleryTypeHalf, galleryTypeFull }) => {
      const mediaCount = media?.length ?? 0;
      const isFullWidth = width === "fullWidth";
      const galleryType = isFullWidth ? galleryTypeFull || "mediaFull" : galleryTypeHalf || "grid";

      const typeLabels: Record<string, string> = {
        single: "Single",
        grid: "Grid",
        carousel: "Carousel",
        mediaFull: "Media Full",
        dynamic: "Dynamic",
        doubleStickyFull: "Double Sticky",
        carouselFull: "Carousel",
      };

      const widthLabel = isFullWidth ? "Full width" : "Default";
      const subtitle = `${widthLabel} · ${typeLabels[galleryType] || galleryType} · ${mediaCount} ${mediaCount === 1 ? "item" : "items"}`;

      return {
        title: "Media Gallery",
        subtitle,
      };
    },
  },
});
