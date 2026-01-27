---
description: When working with Sanity schemas, Studio, or CMS content modeling
globs:
alwaysApply: false
---

# Sanity Schema Development

## Guiding Philosophy

- **World-class editor experience** - Provide proactive guidance, tips, and smart validations
- **Zero tolerance for missing descriptions** - Every field should guide the editor
- **Accessibility-first content** - Make it hard to publish inaccessible content
- Model content based on what things ARE, not how they appear

## Schema Structure

### Always use helper functions

- `defineType` for documents/objects
- `defineField` for custom fields only
- `defineArrayMember` for array members

### Use generator fields from `@/schemas/generator-fields/`

Available generators:

- `stringField()` - text fields
- `linksField()` - link arrays with multiple types
- `figureField()` - images with alt-text validation
- `datetimeField()` - date/time fields
- `slugField()` - URL slugs
- `metadataField()` - SEO metadata
- `referenceField()` - references (prefer `allowMultiple: true` with `max: 1` over single)
- `portableTextWithBlocksField()` - rich text
- `infoField()` - contextual guidance for editors

### File naming

- Schema files: `name.schema.ts` (e.g., `article.schema.ts`)
- Field generators: `name.field.ts` or `name.field.tsx`

## User-Facing Text Language

- Examine existing schemas - if titles are Norwegian ("Tittel", "Beskrivelse"), continue in Norwegian
- Keep variable names, functions, and internal code in English
- Schema `name`: English camelCase (e.g., `article`, `heroSection`)
- Schema `title`: Norwegian (e.g., "Artikkel", "Helteseksjon")

## Required Schema Elements

Every document schema must have:

- Icon from the project's icon library
- Groups using `defaultGroups` from `@/schemas/utils/default-groups.util`
- `linkable: true` option if it should be linkable
- Generator fields instead of raw defineField calls
- Comprehensive descriptions for all user-facing fields

## Field Generator Examples

```typescript
// String field with validation
stringField({
  name: "title",
  title: "Tittel",
  required: true,
  group: "key",
})

// Reference field (prefer multiple even with max: 1)
referenceField({
  name: "categories",
  title: "Kategorier",
  to: [{ type: "category" }],
  allowMultiple: true,
  max: 3,
})

// Info field for document guidance
infoField({
  title: "Om artikler",
  description: "Artikler er hovedinnholdet på nettsiden.",
  tone: "positive",
  icon: Lightbulb,
  group: "key",
})
```

## Validation Best Practices

- Use `Rule.warning()` for length recommendations
- Provide helpful error messages that teach, not criticize
- Implement accessibility validations (alt-text, link text, heading length)

```typescript
stringField({
  name: "seoTitle",
  title: "SEO-tittel",
  description: "Optimal lengde er 50-60 tegn.",
  validation: Rule => Rule
    .max(60).warning("Tittelen kan bli kuttet av i søkeresultater")
    .min(30).warning("Vurder å gjøre tittelen mer beskrivende"),
})
```

## GROQ Query Standards

- Use `defineQuery` from `groq` or `next-sanity`
- Put each filter segment and attribute on its own line
- Use parameters for variables, never string interpolation

```typescript
import { defineQuery } from "groq";

export const POST_QUERY = defineQuery(`*[
  _type == "post"
  && slug.current == $slug
][0]{
  _id,
  title,
  author->{
    _id,
    name
  }
}`);
```

## Page Builder Blocks

Page builder blocks use `defineBlock()` from `@/schemas/utils/define-block.util`. This utility:

- Creates consistent block structure with `name.block` type naming
- **Automatically adds a `width` option** (`"default"` or `"fullWidth"`) to all blocks
- Wraps fields in an `options` object

**Block definition pattern:**

```typescript
import { defineBlock } from "@/schemas/utils/define-block.util";

export const myBlockSchema = defineBlock({
  name: "myBlock",
  title: "My Block",
  icon: SomeIcon,
  scope: ["pageBuilder", "portableText"],
  fields: [
    // Block content fields
  ],
  optionFields: [
    // Additional options - width is auto-added first
  ],
  preview: {
    prepare: () => ({ title: "My Block" }),
  },
});
```

**Important:** Do NOT add a width/layout field manually - `defineBlock` adds it automatically.

**Query pattern:** Always include `width` in block queries:

```groq
options {
  width,
  // other block-specific options
}
```

