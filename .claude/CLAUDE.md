# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Workflow Notes

### Keep Documentation Updated

**This file (`CLAUDE.md`) must be kept up to date with structural changes to the project.**

When making changes that affect project architecture, patterns, or conventions, update this documentation accordingly. This includes:

- New routing patterns or route additions
- Changes to folder structure or file organization
- New shared utilities, components, or patterns
- Updates to build processes or commands
- Changes to internationalization setup
- New Sanity schema patterns or field generators

The goal is to ensure this file accurately reflects how the project works, so future development sessions have correct context.

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
| **Sanity** | Query/mutate Sanity content, manage schemas, releases, and documents. Use this to search for documentation for everything sanity related |
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

#### Route System (English-Based)

Routes use **English as the internal/code base** while Norwegian remains the default locale. Configuration is in `packages/routing/src/route.config.ts`.

**How it works:**

| User URL                  | Locale | Internal Path (File System)        |
| ------------------------- | ------ | ---------------------------------- |
| `/tjenester`              | `no`   | `app/[locale]/services/`           |
| `/en/services`            | `en`   | `app/[locale]/services/`           |
| `/kunnskap/artikler`      | `no`   | `app/[locale]/knowledge/articles/` |
| `/en/knowledge/articles`  | `en`   | `app/[locale]/knowledge/articles/` |

**Key files:**

- `packages/routing/src/route.config.ts` - Route definitions and translations
  - `routeConfig` - English internal paths (e.g., `/services/:slug`)
  - `routeTranslations` - Maps English → Norwegian (e.g., `services` → `tjenester`)
  - `pathnames` - next-intl config for URL localization
- `apps/frontend/src/i18n/routing.ts` - next-intl routing setup
- `apps/frontend/middleware.ts` - Handles URL translation

**Using routes in components:**

```tsx
// Always use English paths in code - middleware handles translation
<Link href="/services">Services</Link>
<Link href={`/projects/${slug}`}>Project</Link>

// For programmatic navigation with locale awareness, use resolvePath:
import { resolvePath } from "@workspace/routing";
const url = resolvePath("service", { slug: "consulting" }, "no"); // → "/tjenester/consulting"
```

**Adding a new route:**

1. Add to `routeConfig` with English path
2. Add translation to `routeTranslations` (both `no` and `en` keys)
3. Add to `pathnames` with locale-specific URLs
4. Create folder in `apps/frontend/src/app/[locale]/` using English name

#### UI String Translations

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

### Cache Revalidation

The frontend uses **tag-based cache revalidation** triggered by Sanity webhooks.

**How it works:**

1. Queries use `tags` parameter to mark cached data (e.g., `tags: ["newsArticle"]`)
2. When content is published in Sanity, a webhook POSTs to `/api/revalidate`
3. The endpoint invalidates relevant cache tags based on document type
4. Next.js serves fresh content on the next request

**Key files:**

- `apps/frontend/src/app/api/revalidate/route.ts` - Webhook handler
- `apps/frontend/src/env.ts` - `SANITY_REVALIDATE_SECRET` environment variable

**Tag mapping** (document type → cache tags):

| Document Type | Tags Invalidated |
|---------------|------------------|
| `newsArticle` | `newsArticle`, `newsAndEventsArchive` |
| `caseStudy` | `caseStudy`, `caseStudyArchive`, `knowledgeHub` |
| `service` | `service`, `servicesArchive` |
| `client` | `client`, `clientArchive` |
| `seminar` | `seminar`, `seminarArchive`, `knowledgeHub` |
| `eBook` | `eBook`, `eBookArchive`, `knowledgeHub` |
| `knowledgeArticle` | `knowledgeArticle`, `knowledgeArticleArchive`, `knowledgeHub` |
| Settings types | Their respective tags |

**Adding revalidation for a new document type:**

1. Add tags to your `sanityFetch` calls: `tags: ["myType"]`
2. Add mapping in `/api/revalidate/route.ts` `TAG_MAP`

**Environment variables:**

- `SANITY_REVALIDATE_SECRET` - Shared secret between Sanity webhook and frontend (required)

**Sanity webhook configuration** (sanity.io/manage → API → Webhooks):

- URL: `https://your-domain.com/api/revalidate`
- Trigger on: Create, Update, Delete
- Projection: `{_type, _id, "slug": slug.current}`
- Secret: Same as `SANITY_REVALIDATE_SECRET`

### Pre-commit Hooks

Lefthook runs on pre-commit:

- Biome check with auto-fix on staged files
- Type generation when schema or query files change

If you modify `lefthook.yml`, run `pnpm lefthook install` to update git hooks.
