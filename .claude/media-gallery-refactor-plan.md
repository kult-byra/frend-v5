# Media Gallery Refactor Plan

## Overview

Consolidate media display blocks into a single "Media Gallery" block.

## Changes

| Action | From | To |
|--------|------|-----|
| **Rename** | `imageGallery` | `mediaGallery` |
| **Rename field** | `images` | `media` |
| **Remove** | `imagesAndText` | (deleted) |
| **Remove** | `imagesWithBanner` | (deleted) |

## Migration Strategy

### 1. Sanity Migration Script

Location: `apps/studio/migrations/media-gallery-refactor/index.ts`

**Operations:**
1. Find all `imageGallery` blocks in page builder arrays and portable text
2. Rename `_type` from `imageGallery` to `mediaGallery`
3. Rename `images` field to `media`
4. Remove `imagesAndText` blocks from arrays
5. Remove `imagesWithBanner` blocks from arrays

**Note:** Removing `imagesAndText` and `imagesWithBanner` is destructive. Any content using these blocks will be lost. Run with `--dry` first to review.

### 2. Schema Changes

**Rename files:**
- `image-gallery.block.schema.ts` → `media-gallery.block.schema.ts`

**Update schema:**
```typescript
// name: "imageGallery" → "mediaGallery"
// title: "Image gallery" → "Media Gallery"
// field "images" → "media"
```

### 3. Frontend Changes

**Rename files:**
- `image-gallery.block.component.tsx` → `media-gallery.block.component.tsx`
- `image-gallery.block.query.ts` → `media-gallery.block.query.ts`

**Delete files:**
- `images-and-text.block.component.tsx`
- `images-and-text.block.query.ts`
- `images-with-banner.block.component.tsx`
- `images-with-banner.block.query.ts`

**Update imports in:**
- `apps/studio/src/schemas/blocks/index.ts`
- `apps/frontend/src/components/page-builder/page-builder.component.tsx`
- `apps/frontend/src/components/portable-text/portable-text.component.tsx`
- `apps/frontend/src/server/queries/page-builder/page-builder-full.query.ts`
- `apps/frontend/src/server/queries/portable-text/portable-text.query.ts`

### 4. Execution Order

1. **Run migration (dry)**: `cd apps/studio && npx sanity migration run media-gallery-refactor --dry`
2. **Review output** - check what will be changed/removed
3. **Run migration**: `npx sanity migration run media-gallery-refactor`
4. **Update code** - apply all file renames and deletions
5. **Run typegen**: `pnpm typegen`
6. **Test**: Verify in dev environment

## Files Affected

### Studio (Schema)
- `apps/studio/src/schemas/blocks/image-gallery.block.schema.ts` (rename + update)
- `apps/studio/src/schemas/blocks/images-and-text.block.schema.ts` (delete)
- `apps/studio/src/schemas/blocks/images-with-banner.block.schema.ts` (delete)
- `apps/studio/src/schemas/blocks/index.ts` (update imports)
- `apps/studio/src/schemas/blocks/content.block.schema.ts` (check for references)

### Frontend (Components)
- `apps/frontend/src/components/blocks/image-gallery.block.component.tsx` (rename + update)
- `apps/frontend/src/components/blocks/images-and-text.block.component.tsx` (delete)
- `apps/frontend/src/components/blocks/images-with-banner.block.component.tsx` (delete)
- `apps/frontend/src/components/page-builder/page-builder.component.tsx` (update)
- `apps/frontend/src/components/portable-text/portable-text.component.tsx` (update)

### Frontend (Queries)
- `apps/frontend/src/server/queries/blocks/image-gallery.block.query.ts` (rename + update)
- `apps/frontend/src/server/queries/blocks/images-and-text.block.query.ts` (delete)
- `apps/frontend/src/server/queries/blocks/images-with-banner.block.query.ts` (delete)
- `apps/frontend/src/server/queries/page-builder/page-builder-full.query.ts` (update)
- `apps/frontend/src/server/queries/portable-text/portable-text.query.ts` (update)
- `apps/frontend/src/server/queries/documents/service.query.ts` (check for references)

### New Files
- `apps/studio/migrations/media-gallery-refactor/index.ts` (migration script)

## Risks

1. **Data loss**: `imagesAndText` and `imagesWithBanner` content will be removed
2. **Build breaks**: Must update all imports before building
3. **Cache**: May need to clear Sanity cache after migration

## Rollback

If needed, create a reverse migration that:
1. Renames `mediaGallery` back to `imageGallery`
2. Renames `media` field back to `images`

(Cannot restore deleted `imagesAndText`/`imagesWithBanner` content without backup)
