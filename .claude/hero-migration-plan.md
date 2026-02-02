# Hero System Migration Plan

## Overview

Migrate from the current `heroFields()` generator function (which spreads fields at document root) to a polymorphic `hero` object schema with multiple hero types. This enables editors to swap hero types on any page.

## Current State

### `heroFields()` Generator
Location: `apps/studio/src/schemas/generator-fields/hero-fields.field.ts`

A function that returns an array of field definitions spread at the document root:
- `title` (required)
- `slug` (optional, controlled by `isStatic`)
- `excerpt` (optional rich text)
- `media` / `coverImages` (optional image/video)
- `author` (optional person reference)
- `publishDate` (optional datetime)
- `links` (optional CTA links)

Supports a `suffix` parameter for singleton i18n (`title_no`, `title_en`).

### Documents Using `heroFields()`

| Document | Location | Configuration |
|----------|----------|---------------|
| `page` | `documents/page.schema.ts` | excerpt, links, no cover image |
| `conversionPage` | `documents/conversion-page.schema.ts` | Check file for config |
| `newsArticle` | `documents/news-and-events/news-article.schema.ts` | publishDate, author, multiple cover images |
| `event` | `documents/news-and-events/event.schema.ts` | default |
| `caseStudy` | `documents/knowledge-hub/case-study.schema.ts` | default |
| `knowledgeArticle` | `documents/knowledge-hub/knowledge-article.schema.ts` | publishDate, author |
| `seminar` | `documents/knowledge-hub/seminar.schema.ts` | publishDate, author, excerpt |
| `eBook` | `documents/knowledge-hub/e-book.schema.ts` | default |
| `servicesArchive` | `documents/services/services-archive.schema.ts` | isStatic, excerpt, suffix pattern |
| `newsAndEventsArchive` | `documents/news-and-events/news-and-events-archive.schema.ts` | isStatic, suffix pattern |
| `clientArchive` | `documents/clients/client-archive.schema.ts` | isStatic, suffix pattern |
| `knowledgeHub` | `documents/knowledge-hub/knowledge-hub.schema.ts` | isStatic, no cover image, suffix pattern |
| `caseStudyArchive` | `documents/knowledge-hub/case-study-archive.schema.ts` | isStatic, no cover image, suffix pattern |
| `knowledgeArticleArchive` | `documents/knowledge-hub/knowledge-article-archive.schema.ts` | isStatic, no cover image, suffix pattern |
| `seminarArchive` | `documents/knowledge-hub/seminar-archive.schema.ts` | isStatic, no cover image, suffix pattern |
| `eBookArchive` | `documents/knowledge-hub/e-book-archive.schema.ts` | isStatic, no cover image, suffix pattern |

### Current `hero` Schema (Front Page Only)
Location: `apps/studio/src/schemas/fields/hero.schema.ts`

Currently only used by front page with one variant: `mediaAndFormHero`.

---

## Target State

### New Hero Type Schemas

Create 4 hero variant types in `apps/studio/src/schemas/fields/hero.schema.ts`:

#### 1. `textHero`
For pages without media.
```typescript
fields: [
  title (required),
  excerpt (portable text, optional),
  links (array, max 2, optional)
]
```

#### 2. `mediaHero`
General purpose with media.
```typescript
fields: [
  title (required),
  media (image/video/illustration),
  excerpt (portable text, optional),
  links (array, max 2, optional)
]
```

#### 3. `articleHero`
For editorial content with byline.
```typescript
fields: [
  title (required),
  media (image/video, support for 1-3 images via array),
  author (reference to person, optional),
  publishDate (datetime, optional),
  excerpt (portable text, optional)
]
```

#### 4. `formHero`
For lead generation pages (rename from `mediaAndFormHero`).
```typescript
fields: [
  title (required),
  media (image/video),
  form (reference to hubspotForm)
]
```

### Wrapper `hero` Schema
```typescript
heroSchema = {
  name: "hero",
  type: "object",
  fields: [
    {
      name: "heroType",
      type: "string",
      options: {
        list: [
          { title: "Text", value: "textHero" },
          { title: "Media", value: "mediaHero" },
          { title: "Article", value: "articleHero" },
          { title: "Form", value: "formHero" },
        ],
        layout: "radio"
      },
      initialValue: "mediaHero"
    },
    { name: "textHero", type: "textHero", hidden: ({ parent }) => parent?.heroType !== "textHero" },
    { name: "mediaHero", type: "mediaHero", hidden: ({ parent }) => parent?.heroType !== "mediaHero" },
    { name: "articleHero", type: "articleHero", hidden: ({ parent }) => parent?.heroType !== "articleHero" },
    { name: "formHero", type: "formHero", hidden: ({ parent }) => parent?.heroType !== "formHero" },
  ]
}
```

### Archive Singletons (Suffix Pattern)

For singleton archive documents that use field-level i18n, use the hero object per language:

```typescript
// In archive schema
fields: [
  { name: "hero_no", type: "hero", group: "no" },
  { name: "hero_en", type: "hero", group: "en" },
]
```

### Slug Field

Move `slug` to document root level (outside hero) since it's language-independent and doesn't belong in a language-suffixed hero object.

---

## Migration Tasks

### Task 1: Schema - Hero Types (AGENT 1)

**File:** `apps/studio/src/schemas/fields/hero.schema.ts`

1. Create `textHeroSchema` with fields: title, excerpt, links
2. Create `mediaHeroSchema` with fields: title, media, excerpt, links
3. Create `articleHeroSchema` with fields: title, media (array 1-3), author, publishDate, excerpt
4. Rename `mediaAndFormHeroSchema` to `formHeroSchema`, update fields: title, media, form
5. Update `heroSchema` wrapper to include all 4 types with heroType selector
6. Export all schemas

**Use existing generator fields:**
- `stringField()` for title
- `mediaField()` for media
- `portableTextField()` for excerpt
- `linksField()` for links
- `referenceField()` for author and form
- `datetimeField()` for publishDate

**File:** `apps/studio/src/schemas/fields/index.ts`
- Update exports to include new hero types

### Task 2: Schema - Regular Documents (AGENT 2)

Update these documents to use new `hero` object:

**Documents to update:**
- `apps/studio/src/schemas/documents/page.schema.ts`
- `apps/studio/src/schemas/documents/conversion-page.schema.ts`
- `apps/studio/src/schemas/documents/front-page.schema.ts`

**Pattern:**
```typescript
// Before
...heroFields({ includeCoverImage: false, includeExcerpt: true, includeLinks: true }),

// After
slugField({ isStatic: false }), // Move slug to root
defineField({
  name: "hero",
  type: "hero",
  group: "key",
}),
```

Remove import of `heroFields`, add import for `slugField`.

### Task 3: Schema - Article Documents (AGENT 3)

Update editorial content documents:

**Documents to update:**
- `apps/studio/src/schemas/documents/news-and-events/news-article.schema.ts`
- `apps/studio/src/schemas/documents/news-and-events/event.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/case-study.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/knowledge-article.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/seminar.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/e-book.schema.ts`

**Pattern:** Same as Task 2, but these will typically use `articleHero` type.

### Task 4: Schema - Archive Singletons (AGENT 4)

Update singleton archive documents with suffix pattern:

**Documents to update:**
- `apps/studio/src/schemas/documents/services/services-archive.schema.ts`
- `apps/studio/src/schemas/documents/news-and-events/news-and-events-archive.schema.ts`
- `apps/studio/src/schemas/documents/clients/client-archive.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/knowledge-hub.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/case-study-archive.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/knowledge-article-archive.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/seminar-archive.schema.ts`
- `apps/studio/src/schemas/documents/knowledge-hub/e-book-archive.schema.ts`

**Pattern:**
```typescript
// Before
...heroFields({ isStatic: true, includeExcerpt: true, suffix: "_no", group: "no" }),
...heroFields({ isStatic: true, includeExcerpt: true, suffix: "_en", group: "en" }),

// After
slugField({ isStatic: true }), // Single slug at root
defineField({
  name: "hero_no",
  title: "Hero (Norwegian)",
  type: "hero",
  group: "no",
}),
defineField({
  name: "hero_en",
  title: "Hero (English)",
  type: "hero",
  group: "en",
}),
```

### Task 5: Queries - Hero Query Utils (AGENT 5)

**File:** `apps/frontend/src/server/queries/utils/hero.query.ts`

Update to query all hero types:

```typescript
const textHeroQuery = `
  title,
  excerpt[] { ... },
  links[] { ... }
`;

const mediaHeroQuery = `
  title,
  media { ${mediaQuery} },
  excerpt[] { ... },
  links[] { ... }
`;

const articleHeroQuery = `
  title,
  media[] { ${mediaQuery} },
  author-> { _id, name, image { ${imageQuery} } },
  publishDate,
  excerpt[] { ... }
`;

const formHeroQuery = `
  title,
  media { ${mediaQuery} },
  form-> { _id, title, formId }
`;

export const heroQuery = `
  heroType,
  textHero { ${textHeroQuery} },
  mediaHero { ${mediaHeroQuery} },
  articleHero { ${articleHeroQuery} },
  formHero { ${formHeroQuery} }
`;
```

Update typegen query and exported types.

### Task 6: Queries - Document Queries (AGENT 6)

Update all document queries to use new hero structure:

**Files to update:**
- `apps/frontend/src/server/queries/documents/*.query.ts`
- Check for any direct references to `title`, `excerpt`, `media`, `author`, `publishDate` at root level

**Pattern:**
```groq
// Before
title,
slug,
excerpt,
media { ... },

// After
slug,
hero { ${heroQuery} },
```

For archive singletons:
```groq
// Before
"title": title_no,
"excerpt": excerpt_no,

// After
"hero": hero_no { ${heroQuery} },
```

### Task 7: Frontend - Hero Components (AGENT 7)

**Location:** `apps/frontend/src/components/hero/`

1. Create `text-hero.component.tsx`
2. Create `media-hero.component.tsx`
3. Create `article-hero.component.tsx`
4. Rename `media-and-form-hero.component.tsx` to `form-hero.component.tsx`
5. Update `hero.component.tsx` to switch on all 4 types

**Pattern for hero.component.tsx:**
```tsx
export const Hero = ({ hero }: { hero: HeroData }) => {
  switch (hero.heroType) {
    case "textHero":
      return hero.textHero ? <TextHero {...hero.textHero} /> : null;
    case "mediaHero":
      return hero.mediaHero ? <MediaHero {...hero.mediaHero} /> : null;
    case "articleHero":
      return hero.articleHero ? <ArticleHero {...hero.articleHero} /> : null;
    case "formHero":
      return hero.formHero ? <FormHero {...hero.formHero} /> : null;
    default:
      return null;
  }
};
```

### Task 8: Frontend - Page Components (AGENT 8)

Update page components to pass hero object:

**Files to check/update:**
- `apps/frontend/src/app/[locale]/page.tsx` (front page)
- `apps/frontend/src/app/[locale]/[slug]/page.tsx` (dynamic pages)
- All page components in `(parts)/` directories
- Check `apps/frontend/src/app/[locale]/services/` and other route directories

**Pattern:**
```tsx
// Before
<h1>{data.title}</h1>
<SomeHeroDisplay media={data.media} excerpt={data.excerpt} />

// After
<Hero hero={data.hero} />
```

### Task 9: Data Migration Script (AGENT 9)

Create a Sanity migration script to move existing data.

**File:** `apps/studio/migrations/hero-migration.ts` (or similar)

**For regular documents:**
```javascript
// Pseudocode
export async function migrate(client) {
  // Fetch all documents using heroFields
  const docs = await client.fetch(`*[_type in ["page", "newsArticle", ...]]`);

  for (const doc of docs) {
    // Determine hero type based on existing fields
    const heroType = determineHeroType(doc);

    // Build hero object from root fields
    const hero = {
      heroType,
      [heroType]: {
        title: doc.title,
        media: doc.media,
        excerpt: doc.excerpt,
        // etc based on type
      }
    };

    // Patch document
    await client.patch(doc._id)
      .set({ hero, slug: doc.slug })
      .unset(['title', 'media', 'excerpt', 'author', 'publishDate', 'links', 'coverImages'])
      .commit();
  }
}
```

**For archive singletons:**
```javascript
// Handle suffix pattern
const hero_no = {
  heroType: 'textHero',
  textHero: {
    title: doc.title_no,
    excerpt: doc.excerpt_no,
  }
};
const hero_en = { ... };

await client.patch(doc._id)
  .set({ hero_no, hero_en })
  .unset(['title_no', 'title_en', 'excerpt_no', 'excerpt_en', ...])
  .commit();
```

### Task 10: Cleanup (AGENT 10)

After migration is complete:

1. Delete `apps/studio/src/schemas/generator-fields/hero-fields.field.ts`
2. Remove any unused imports across schema files
3. Run `pnpm typegen` to regenerate types
4. Run `pnpm check && pnpm typecheck` to verify

---

## Parallel Execution Strategy

**Phase 1 - Schema (can run in parallel):**
- Agent 1: Hero type schemas
- Agent 2: Regular document schemas (depends on Agent 1)
- Agent 3: Article document schemas (depends on Agent 1)
- Agent 4: Archive singleton schemas (depends on Agent 1)

**Phase 2 - Queries (after Phase 1):**
- Agent 5: Hero query utils
- Agent 6: Document queries (depends on Agent 5)

**Phase 3 - Frontend (after Phase 2):**
- Agent 7: Hero components
- Agent 8: Page components (depends on Agent 7)

**Phase 4 - Migration (after Phase 3):**
- Agent 9: Data migration script

**Phase 5 - Cleanup (after Phase 4):**
- Agent 10: Remove old code, run checks

---

## Important Notes

1. **Run `pnpm typegen`** after schema changes to regenerate TypeScript types
2. **Use existing generator fields** - don't recreate field definitions manually
3. **Check DESIGN.md** for styling when creating new hero components
4. **Preserve existing functionality** - new heroes should render same as before visually
5. **Test with `pnpm check && pnpm typecheck`** after each phase

## Files Reference

**Schema generator fields:** `apps/studio/src/schemas/generator-fields/`
**Document schemas:** `apps/studio/src/schemas/documents/`
**Field schemas:** `apps/studio/src/schemas/fields/`
**Queries:** `apps/frontend/src/server/queries/`
**Components:** `apps/frontend/src/components/`
**Hero components:** `apps/frontend/src/components/hero/`
