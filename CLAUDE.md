# Frend Project - Claude Code Instructions

This project uses Claude Code's recommended configuration structure. All detailed instructions are in `.claude/`.

## Configuration Structure

```
.claude/
├── CLAUDE.md               # Main project instructions (commands, architecture, patterns)
├── DESIGN.md               # Design system tokens and UI specifications - READ FOR ALL UI WORK
└── rules/
    ├── code-style.md       # Naming, file structure, TypeScript conventions
    ├── sanity-schema.md    # Sanity schema development patterns
    ├── tailwind-v4.md      # Tailwind CSS v4 specifics
    ├── nextjs.md           # Next.js App Router and caching patterns
    ├── accessibility.md    # WCAG 2.1 AA, SEO, card accessibility
    ├── container-queries.md # Container query usage guidelines
    ├── forms.md            # RHF + Zod + Server Actions patterns
    ├── pagination.md       # SEO-friendly pagination
    └── type-first.md       # Type generation workflow
```

## Essential Rules

### Keep Documentation Updated

**The `.claude/CLAUDE.md` file must be kept up to date with structural changes to the project.**

When making changes that affect project architecture, patterns, or conventions, update the documentation accordingly. This includes:

- New routing patterns or route additions
- Changes to folder structure or file organization
- New shared utilities, components, or patterns
- Updates to build processes or commands
- Changes to internationalization setup
- New Sanity schema patterns or field generators

**The `design.md` file must also be kept updated for new global variables and tailwind configuration**

### Always Read DESIGN.md for UI Work

When implementing any styling or UI components, **always read `.claude/DESIGN.md`** first. It contains:

- Grid configurations and breakpoints
- Spacing scale and usage guidelines
- Color tokens (primitives and semantic roles)
- Typography specifications
- Button, link, and form element patterns

### Type Generation After Schema Changes

After modifying any `.schema.ts` or `.query.ts` files:

```bash
pnpm typegen
```

### Dev Server Assumptions

The dev server (`pnpm dev`) is typically already running. If testing shows no response, prompt the user to start it.

### Available MCP Servers

| Server | Purpose |
|--------|---------|
| **Sanity** | Query/mutate content, manage schemas and documents |
| **Figma** | Get design context (user has usually already selected a node) |
| **Playwright** | Browser automation for testing |
| **Next.js DevTools** | Query running dev server for errors, routes |
| **TailwindCSS** | Get utilities, colors, documentation |

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

**Routing principle**: Internal paths (code, file system) use **English**. URLs are localized per locale.

**Route configuration** is defined in `packages/routing/src/route.config.ts`:

- `routeConfig` - Internal paths in English (e.g., `/services`, `/knowledge`)
- `routeTranslations` - Maps English segments to localized segments
- `pathnames` - next-intl configuration for URL localization

**URL structure**:

| Internal Path     | Norwegian URL (`no`) | English URL (`en`)   |
| ----------------- | -------------------- | -------------------- |
| `/services`       | `/tjenester`         | `/en/services`       |
| `/services/:slug` | `/tjenester/:slug`   | `/en/services/:slug` |
| `/knowledge`      | `/kunnskap`          | `/en/knowledge`      |
| `/articles`       | `/artikler`          | `/en/articles`       |

**Generating URLs programmatically**:

```typescript
import { resolvePath } from "@workspace/routing";

// Returns "/tjenester/konsulenter" for Norwegian
const url = resolvePath("service", { slug: "konsulenter" }, "no");

// Returns "/en/services/consultants" for English
const url = resolvePath("service", { slug: "consultants" }, "en");
```

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
