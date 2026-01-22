# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Workflow Notes

### Type Generation After Schema Changes

After modifying any `.schema.ts` or `.query.ts` files, you MUST run:

```bash
pnpm typegen
```

This generates TypeScript types from Sanity schemas and GROQ queries. Type generation also runs automatically on pre-commit, but running it manually ensures you have correct types immediately.

### Design System Rules

**Always read and follow [DESIGN.md](./DESIGN.md) when working on any styling or UI components.**

This file contains the complete design system including:
- Grid configurations and breakpoints
- Spacing scale and usage guidelines
- Color tokens (primitives and semantic roles)
- Typography specifications
- Button and link styles
- Form element patterns
- Icon and illustration usage

When implementing UI, refer to DESIGN.md for the correct tokens, sizes, and patterns.

### Dev Server Assumptions

The development server (`pnpm dev`) is typically already running. When testing or verifying changes:
1. Assume the dev server is active
2. If you get connection errors or no response, prompt: "The dev server doesn't appear to be running. Please start it with `pnpm dev`."

### Available MCP Servers

This project has several MCP (Model Context Protocol) servers configured:

| Server | Purpose |
|--------|---------|
| **Sanity** | Query/mutate Sanity content, manage schemas, releases, and documents |
| **Figma** | Get design context from Figma files for UI implementation |
| **Playwright** | Browser automation for testing and verification |
| **Next.js DevTools** | Query running Next.js dev server, get errors, route info |
| **TailwindCSS** | Get Tailwind utilities, colors, and documentation |

**Figma Usage**: When referencing Figma designs, the user has typically already selected a node in the Figma desktop app. Use `mcp__figma__get_design_context` to fetch the selected design.

---

## Commands

```bash
# Development
pnpm dev                    # Run all apps (frontend + studio)
pnpm frontend dev           # Run frontend only
pnpm studio dev             # Run studio only

# Build & Quality
pnpm build                  # Build all apps
pnpm typecheck              # Type check all apps
pnpm lint                   # Check with Biome
pnpm check                  # Check and auto-fix with Biome

# Type Generation (runs automatically on pre-commit for schema/query changes)
pnpm typegen                # Generate types from Sanity schemas and queries

# Troubleshooting
pnpm remove-all && pnpm install -r   # Clean reinstall if stuff breaks
```

## Architecture

### Monorepo Structure

- `apps/frontend` - Next.js 16 with next-intl for i18n routing
- `apps/studio` - Sanity Studio CMS
- `packages/routing` - Shared routing config used by both apps

### Internationalization

**Locales**: `no` (default), `en`

**Route translations** are defined in `packages/routing/src/route.config.ts`. Norwegian paths are canonical, English paths are translated (e.g., `/tjenester` → `/services`).

**UI string translations** are managed in Sanity (NOT static JSON files):

- Schema: `apps/studio/src/schemas/settings/string-translations.schema.ts`
- Query: `apps/frontend/src/server/queries/settings/string-translations.query.ts`
- Access via `fetchSettings(locale).stringTranslations`

To add a translatable string:

1. Add field to schema (use flat structure with fieldsets)
2. Add field to query
3. Access via `fetchSettings(locale).stringTranslations.fieldName`

### Sanity Studio Configuration

**Multi-workspace setup** in `apps/studio/sanity.config.ts`:

- Separate workspaces per language (`/admin/no`, `/admin/en`)
- Each workspace filters documents and templates by language
- Uses `@sanity/document-internationalization` plugin for the "Translations" button

**Centralized constants** in `apps/studio/src/utils/`:

- `I18N_SCHEMA_TYPES` - Document types supporting internationalization (add new i18n types here)
- `SINGLETON_TYPES` - Auto-derived from schemas with `options.singleton: true`

**Adding a new i18n document type**:

1. Add type name to `I18N_SCHEMA_TYPES` in `apps/studio/src/utils/i18n-schema-types.util.ts`
2. Include `language` field in schema (hidden, read-only - managed by plugin)
3. The type will automatically get: language filtering, badges, preview warnings, template filtering

### Sanity Schema Patterns

**Generator fields** (`apps/studio/src/schemas/generator-fields/`) are reusable field factories:

- `referenceField()` - Single or multiple references with filtering
- `portableTextField()` - Rich text with configurable blocks
- `mediaField()` - Composite media field (see Media Fields section below)
- `imageField()` - Standalone image with alt text and caption
- `videoField()` - Video URL field with validation
- `illustrationField()` - SVG illustration picker
- `slugField()` - URL slugs with auto-generation

### Media Fields

The media system uses a composite `mediaField()` that combines image, video, and illustration options.

**Schema usage** (`apps/studio/src/schemas/generator-fields/media.field.tsx`):

```typescript
import { mediaField } from "@/schemas/generator-fields/media.field";

// Image only (default)
mediaField({ name: "media" })

// Image + video
mediaField({ name: "media", video: true })

// Image + illustration (e.g., for services)
mediaField({ name: "media", illustration: true })

// All options
mediaField({ name: "media", video: true, illustration: true, required: true })
```

**Data structure** stored in Sanity:

```typescript
{
  mediaType: "image" | "video" | "illustration",
  image: { asset, crop, hotspot, altText, caption },  // when mediaType === "image"
  videoUrl: string,                                    // when mediaType === "video"
  illustration: string                                 // when mediaType === "illustration"
}
```

**Query pattern** (GROQ):

```groq
"media": {
  "mediaType": media.mediaType,
  "image": media.image { ${imageQuery} },
  "videoUrl": media.videoUrl,
  "illustration": media.illustration
}
```

**Frontend rendering**:

```tsx
import { Img } from "@/components/utils/img.component";
import { Illustration, type IllustrationName } from "@/components/illustration.component";

// Render based on mediaType
{media?.mediaType === "image" && media.image && (
  <Img {...media.image} sizes={{ md: "third" }} />
)}
{media?.mediaType === "video" && media.videoUrl && (
  <Video url={media.videoUrl} />
)}
{media?.mediaType === "illustration" && media.illustration && (
  <Illustration name={media.illustration as IllustrationName} />
)}
```

**Deprecated aliases** (for backward compatibility):

- `figureField()` → use `imageField()` instead
- `figureOrVideoField()` → use `mediaField({ video: true })` instead

**Settings** are per-language singletons queried together via `fetchSettings(locale)`:

- `siteSettings`, `menuSettings`, `footerSettings`, `metadataSettings`, `stringTranslations`
- Schemas: `apps/studio/src/schemas/settings/`
- Queries: `apps/frontend/src/server/queries/settings/`
- Structure: `apps/studio/src/structure/settings.structure.ts`

**Schema enhancement** happens automatically in `apps/studio/src/schemas/index.ts`:

- `enhanceWithI18nPreview()` adds "No language set" warnings to all i18n document previews

### Frontend Query Pattern

Queries live in `apps/frontend/src/server/queries/` and use `defineQuery()` from next-sanity. Type generation runs automatically on pre-commit when `.schema.ts` or `.query.ts` files change.

### Sanity Images

**For rendered images** (in React components), use `SanityImage` from `sanity-image`:

```tsx
import { SanityImage } from "sanity-image";
import { env } from "@/env";

<SanityImage
  id={asset._id}
  projectId={env.NEXT_PUBLIC_SANITY_PROJECT_ID}
  dataset={env.NEXT_PUBLIC_SANITY_DATASET}
  alt={altText ?? ""}
  width={64}
  height={64}
/>
```

For complex images with sizes/captions, use the `Img` component from `@/components/utils/img.component.tsx`.

**For URL-only needs** (metadata, Open Graph), use `urlForImageId` from `@/server/sanity/sanity-image`:

```tsx
import { urlForImageId } from "@/server/sanity/sanity-image";

const url = urlForImageId(imageId, { width: 800, height: 600 });
```

**Never** manually construct Sanity CDN URLs.

### Icons

The project uses a sprite-based icon system. Icons are rendered via the `Icon` component which references symbols in a generated SVG sprite.

**Files:**

- `apps/frontend/src/components/icon.component.tsx` - Icon component
- `apps/frontend/public/icons/sprite.svg` - Generated SVG sprite
- `apps/frontend/public/icons/name.d.ts` - Generated TypeScript types
- `apps/frontend/svg-icons/` - Source SVG files

**Usage:**

```tsx
import { Icon } from "@/components/icon.component";

<Icon name="arrow-right" />
<Icon name="chevron-down" size="sm" />
<Icon name="close" label="Close menu" />  // Accessible label
```

**Available sizes:** `font` (default, inherits font size), `xs`, `sm`, `md`, `lg`, `xl`

**Adding new icons:**

1. Add SVG file to `apps/frontend/svg-icons/` (kebab-case naming, e.g., `arrow-right.svg`)
2. Run `pnpm build:icons` to regenerate sprite and types
3. Use via `<Icon name="arrow-right" />`

**Note:** Do not use lucide-react or other icon packages in frontend components. The studio uses lucide for Sanity CMS UI only.

### Pre-commit Hooks

Lefthook runs on pre-commit:

- Biome check with auto-fix on staged files
- Type generation when schema or query files change

If you modify `lefthook.yml`, run `pnpm lefthook install` to update git hooks.
