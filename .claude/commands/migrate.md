# Create Sanity Migration for Document Type

You are building a Storyblok → Sanity migration transform for: **$ARGUMENTS**

You must complete this AUTONOMOUSLY — investigate everything yourself, make decisions, and only pause at the field mapping step for user confirmation. Do NOT ask the user for file paths, schema details, or configuration info — discover it all.

## Pre-flight: Load Recipe

Read the migration recipe from memory: `~/.claude/projects/-Users-markusevanger-jobb-repos-frend-v5/memory/sanity-migration-recipe.md`. This has the full architecture, patterns, and gotchas.

## Step 1: Auto-Discover Source Data

1. List directories in `migration-data/stories/` to find the Storyblok component folder matching `$ARGUMENTS` (case-insensitive match)
2. If no match, list available folders and tell the user to download the content first via the migration dashboard
3. Read 3-5 sample JSON files from the matched directory
4. Catalog ALL fields: types, which have data, which are empty, image URLs, junk patterns

## Step 2: Auto-Discover Target Schema

1. Search `apps/studio/src/schemas/documents/` for a schema file matching `$ARGUMENTS` (e.g., `service.schema.ts`, `news-article.schema.ts`)
2. If no exact match, glob for `*.schema.ts` and find the best match
3. Read the schema file completely — note:
   - All fields, their types, and validation rules
   - Field-level i18n fields (`_no`/`_en` suffixes)
   - `mediaField()` usage and configuration
   - Reference fields (`referenceField()`) and what they reference
   - Required fields and conditional logic
   - Whether `slugField()` is present
   - Groups and any `options` (singleton, linkable, etc.)
4. Also check if generator fields are used — read the generator source if needed to understand the structure

## Step 3: Auto-Check Configuration

1. Read `apps/frontend/src/env.ts` — confirm `SANITY_API_WRITE_TOKEN` is registered
2. Read `apps/frontend/src/server/sanity/sanity-write-client.ts` — confirm write client exists
3. Check `apps/frontend/src/lib/storyblok/migration-fs.ts` exists
4. If anything is missing, create it following the existing patterns (see recipe)

## Step 4: Present Field Mapping (PAUSE HERE for user confirmation)

Show the user a mapping table:

| Storyblok Field | Sanity Field | Type | Notes |
|-----------------|-------------|------|-------|
| `content.field` | `sanityField` | Direct / Transform / i18n / etc. | Details |

Include:
- Fields that map directly
- Fields needing transformation
- Fields needing translation (i18n)
- Image fields (note: upload handled by server action)
- Reference fields (note: patched after both docs exist)
- Storyblok fields with NO Sanity equivalent (will be dropped)
- Sanity fields with NO Storyblok source (defaults/computed)

**Ask the user to confirm the mapping before proceeding.**

## Step 5: Create Translation File (if needed)

If the target schema has field-level i18n (`_no`/`_en` suffixes) and the source only has one language:
1. Read ALL story files, extract unique values for each field that needs translation
2. Translate them (Norwegian → English) — generate the translations yourself
3. Save to `migration-data/translations/{type}-translations.json`
4. Structure: `{ [slug]: "translated value" }` (keyed by slug for per-document lookup)

If multiple fields need translation, use a nested structure: `{ [slug]: { field1: "...", field2: "..." } }`

## Step 6: Create Transform

Create `apps/frontend/src/lib/storyblok/transforms/{type}.transform.ts` following the person transform as reference (`apps/frontend/src/lib/storyblok/transforms/person.transform.ts`).

Must include:
- `import "server-only"`
- Storyblok types matching the JSON structure (include `updated_at?: string` on the story type)
- Sanity document type matching the schema exactly
- `TransformResult` type: `{ document, imageUrl, slug, warnings }`
- ID map: `randomUUID()` persisted to `migration-data/id-maps/{type}-ids.json`
- Pure transform function — NO Sanity client, NO fetch calls
- Warnings array for missing/invalid data, missing translations
- Exports: `clearIdMapCache()`, `clearTranslationCache()` (if applicable), `{type}SanityId()`, the transform function, and all types

## Step 7: Add to Server Action

Read the existing server action at `apps/frontend/src/server/actions/sanity-migration.action.ts`. Add:

- Import the new transform, types, and cache-clearing functions
- `{Type}ImportStatus` type (if structure differs from person)
- `get{Type}ImportStatus()` — read persisted status
- `preview{Type}Import()` — reads files, transforms, classifies changes (new/updated/unchanged/deleted), returns preview data
- `import{Type}ToSanity(mode: ImportMode)` — full pipeline with incremental support

Follow the existing person import pattern exactly for:
- Image download from Storyblok CDN → upload to Sanity
- `createOrReplace` with persisted UUIDs
- Incremental sync via `classifyChange()` comparing `updated_at` and image URLs
- Import status persistence (`migration-data/id-maps/{type}-import-status.json`)
- 200ms delay between mutations
- Error isolation per item
- Deletion detection (slugs in previous import but no longer on disk)

## Step 8: Update UI

Read `apps/frontend/src/app/dev/migration/(parts)/sanity-tab.component.tsx`. Add:

1. Import the new preview/import/status functions
2. Add the new document type to the `<select>` dropdown options
3. Wire up the dropdown selection to call the correct preview/import functions based on selected type
4. Make sure the preview table columns make sense for the new type (you may need to generalize column names)

## Step 9: Verify

Run `pnpm check && pnpm typecheck` and fix any issues until both pass cleanly.

Then suggest a commit message following conventional commits format.

## Key Rules

- Transform is PURE — no Sanity client, no fetch calls
- Image upload happens in the server action, NOT the transform
- IDs are random UUIDs persisted to disk — NOT deterministic strings
- Use `createOrReplace` for idempotency
- Media field structure: `{ _type: "media", mediaType: "image", image: { _type: "image", asset: { _type: "reference", _ref } } }`
- References to other documents must be patched AFTER both documents exist
- Button component only supports `"primary" | "secondary"` variants
- `getMigrationDir()` resolves to `{cwd}/../../migration-data` from the frontend app
- Always include `updated_at?: string` on the Storyblok story type for incremental sync
- Storyblok content fields are under `content.*`, NOT at the top level
