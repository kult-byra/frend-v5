import { FileText, Image, LayoutTemplate, Newspaper } from "lucide-react";
import { defineField, defineType } from "sanity";

import { datetimeField } from "@/schemas/generator-fields/datetime.field";
import { linksField } from "@/schemas/generator-fields/links.field";
import { mediaField } from "@/schemas/generator-fields/media.field";
import { portableTextField } from "@/schemas/generator-fields/portable-text/portable-text.field";
import { referenceField } from "@/schemas/generator-fields/reference.field";
import { stringField } from "@/schemas/generator-fields/string.field";

/**
 * Text Hero
 * A minimal hero with title, excerpt, and optional links (no media)
 */
export const textHeroSchema = defineType({
	name: "textHero",
	title: "Text Hero",
	type: "object",
	icon: FileText,
	fields: [
		stringField({
			name: "title",
			title: "Title",
			description: "The main heading displayed in the hero section",
			required: true,
		}),
		portableTextField({
			name: "excerpt",
			title: "Excerpt",
			description: "A brief summary or introduction",
			noContent: true,
			includeLists: true,
		}),
		linksField({
			name: "links",
			title: "Links",
			description: "Call-to-action buttons (max 2)",
			includeExternal: true,
			includeDownload: true,
			max: 2,
		}),
	],
	preview: {
		select: {
			title: "title",
		},
		prepare({ title }) {
			return {
				title: title || "Text Hero",
				subtitle: "Text Hero",
			};
		},
	},
});

/**
 * Media Hero
 * A general-purpose hero with title, media (image/video/illustration), excerpt, and links
 */
export const mediaHeroSchema = defineType({
	name: "mediaHero",
	title: "Media Hero",
	type: "object",
	icon: Image,
	fields: [
		stringField({
			name: "title",
			title: "Title",
			description: "The main heading displayed in the hero section",
			required: true,
		}),
		mediaField({
			name: "media",
			title: "Media",
			description: "Hero image, video, or illustration",
			video: true,
			illustration: true,
		}),
		portableTextField({
			name: "excerpt",
			title: "Excerpt",
			description: "A brief summary or introduction",
			noContent: true,
			includeLists: true,
		}),
		linksField({
			name: "links",
			title: "Links",
			description: "Call-to-action buttons (max 2)",
			includeExternal: true,
			includeDownload: true,
			max: 2,
		}),
	],
	preview: {
		select: {
			title: "title",
			media: "media.image.asset",
		},
		prepare({ title, media }) {
			return {
				title: title || "Media Hero",
				subtitle: "Media Hero",
				media,
			};
		},
	},
});

/**
 * Article Hero
 * For editorial content with byline support (author, publish date, multiple cover images)
 */
export const articleHeroSchema = defineType({
	name: "articleHero",
	title: "Article Hero",
	type: "object",
	icon: Newspaper,
	fields: [
		stringField({
			name: "title",
			title: "Title",
			description: "The article headline",
			required: true,
		}),
		defineField({
			name: "coverImages",
			title: "Cover image(s)",
			description: "One to three cover images or videos",
			type: "array",
			of: [
				mediaField({
					name: "media",
					title: "Media",
					video: true,
				}),
			],
			validation: (Rule) =>
				Rule.min(1).max(3).error("At least one cover image is required and at most three are allowed"),
		}),
		referenceField({
			name: "author",
			title: "Author",
			description: "The article author",
			to: [{ type: "person" }],
		}),
		datetimeField({
			name: "publishDate",
			title: "Publish date",
			description: "When the article was published",
			required: true,
			initialValue: () => new Date().toISOString(),
		}),
		portableTextField({
			name: "excerpt",
			title: "Excerpt",
			description: "A brief summary of the article",
			noContent: true,
			includeLists: true,
		}),
	],
	preview: {
		select: {
			title: "title",
			media: "coverImages.0.image.asset",
			authorName: "author.name",
		},
		prepare({ title, media, authorName }) {
			return {
				title: title || "Article Hero",
				subtitle: authorName ? `Article Hero · ${authorName}` : "Article Hero",
				media,
			};
		},
	},
});

/**
 * Form Hero
 * For lead generation pages with media and a form reference
 */
export const formHeroSchema = defineType({
	name: "formHero",
	title: "Form Hero",
	type: "object",
	icon: LayoutTemplate,
	fields: [
		stringField({
			name: "title",
			title: "Title",
			description: "The main heading displayed in the hero section",
			required: true,
		}),
		mediaField({
			name: "media",
			title: "Media",
			description: "Hero image or video",
			required: true,
			video: true,
		}),
		referenceField({
			name: "form",
			title: "Form",
			description: "Select a HubSpot form to display in the hero",
			to: [{ type: "hubspotForm" }],
		}),
	],
	preview: {
		select: {
			title: "title",
			media: "media.image.asset",
		},
		prepare({ title, media }) {
			return {
				title: title || "Form Hero",
				subtitle: "Form Hero",
				media,
			};
		},
	},
});

/**
 * Hero wrapper schema with type selector
 * Allows editors to choose between different hero presentations
 */
export const heroSchema = defineType({
	name: "hero",
	title: "Hero",
	type: "object",
	fields: [
		defineField({
			name: "heroType",
			title: "Hero type",
			description: "Choose the hero presentation style",
			type: "string",
			options: {
				list: [
					{ title: "Text", value: "textHero" },
					{ title: "Media", value: "mediaHero" },
					{ title: "Article", value: "articleHero" },
					{ title: "Form", value: "formHero" },
				],
				layout: "radio",
			},
			initialValue: "mediaHero",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "textHero",
			title: "Text Hero",
			type: "textHero",
			hidden: ({ parent }) => parent?.heroType !== "textHero",
		}),
		defineField({
			name: "mediaHero",
			title: "Media Hero",
			type: "mediaHero",
			hidden: ({ parent }) => parent?.heroType !== "mediaHero",
		}),
		defineField({
			name: "articleHero",
			title: "Article Hero",
			type: "articleHero",
			hidden: ({ parent }) => parent?.heroType !== "articleHero",
		}),
		defineField({
			name: "formHero",
			title: "Form Hero",
			type: "formHero",
			hidden: ({ parent }) => parent?.heroType !== "formHero",
		}),
	],
	preview: {
		select: {
			heroType: "heroType",
			textHeroTitle: "textHero.title",
			mediaHeroTitle: "mediaHero.title",
			articleHeroTitle: "articleHero.title",
			formHeroTitle: "formHero.title",
			mediaHeroMedia: "mediaHero.media.image.asset",
			articleHeroMedia: "articleHero.coverImages.0.image.asset",
			formHeroMedia: "formHero.media.image.asset",
		},
		prepare({
			heroType,
			textHeroTitle,
			mediaHeroTitle,
			articleHeroTitle,
			formHeroTitle,
			mediaHeroMedia,
			articleHeroMedia,
			formHeroMedia,
		}) {
			const typeLabels: Record<string, string> = {
				textHero: "Text",
				mediaHero: "Media",
				articleHero: "Article",
				formHero: "Form",
			};

			const titleMap: Record<string, string | undefined> = {
				textHero: textHeroTitle,
				mediaHero: mediaHeroTitle,
				articleHero: articleHeroTitle,
				formHero: formHeroTitle,
			};

			// Get the appropriate media based on hero type
			const media =
				heroType === "mediaHero"
					? mediaHeroMedia
					: heroType === "articleHero"
						? articleHeroMedia
						: heroType === "formHero"
							? formHeroMedia
							: undefined;

			return {
				title: titleMap[heroType] || "Hero",
				subtitle: typeLabels[heroType] || heroType,
				media,
			};
		},
	},
});

// Keep backward compatibility export (deprecated, will be removed after migration)
export const mediaAndFormHeroSchema = formHeroSchema;
