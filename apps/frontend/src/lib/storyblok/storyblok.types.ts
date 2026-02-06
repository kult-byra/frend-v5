import { z } from "zod";

export const storyblokComponentSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string().nullable(),
  schema: z.record(z.string(), z.unknown()),
  is_root: z.boolean().optional(),
  is_nestable: z.boolean().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StoryblokComponent = z.infer<typeof storyblokComponentSchema>;

export const storyblokStoryListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  full_slug: z.string(),
  uuid: z.string(),
  parent_id: z.number().nullable(),
  is_folder: z.boolean().optional(),
  created_at: z.string(),
  published_at: z.string().nullable(),
  updated_at: z.string().optional(),
  content_type: z.string().optional(),
});

export type StoryblokStoryListItem = z.infer<typeof storyblokStoryListItemSchema>;

export const storyblokStoryFullSchema = storyblokStoryListItemSchema.extend({
  content: z.record(z.string(), z.unknown()),
});

export type StoryblokStoryFull = z.infer<typeof storyblokStoryFullSchema>;

export const storyblokAssetSchema = z.object({
  id: z.number(),
  filename: z.string(),
  content_type: z.string().nullable(),
  title: z.string().nullable(),
  alt: z.string().nullable(),
  focus: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StoryblokAsset = z.infer<typeof storyblokAssetSchema>;

export const storyblokSpaceSchema = z.object({
  id: z.number(),
  name: z.string(),
  domain: z.string(),
  plan: z.string(),
  plan_level: z.number(),
  stories_count: z.number().optional(),
  assets_count: z.number().optional(),
  created_at: z.string(),
});

export type StoryblokSpace = z.infer<typeof storyblokSpaceSchema>;

export const storyblokDatasourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StoryblokDatasource = z.infer<typeof storyblokDatasourceSchema>;

export const storyblokDatasourceEntrySchema = z.object({
  id: z.number(),
  name: z.string(),
  value: z.string(),
  dimension_value: z.string().nullable().optional(),
});

export type StoryblokDatasourceEntry = z.infer<typeof storyblokDatasourceEntrySchema>;
