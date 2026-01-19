# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Sanity Schema Patterns

**Generator fields** (`apps/studio/src/schemas/generator-fields/`) are reusable field factories:
- `referenceField()` - Single or multiple references with filtering
- `portableTextField()` - Rich text with configurable blocks
- `figureField()` - Images with alt text and caption
- `slugField()` - URL slugs with auto-generation

**Settings** are per-language singletons queried together via `fetchSettings(locale)`:
- `siteSettings`, `menuSettings`, `footerSettings`, `metadataSettings`, `stringTranslations`
- Schemas: `apps/studio/src/schemas/settings/`
- Queries: `apps/frontend/src/server/queries/settings/`
- Structure: `apps/studio/src/structure/settings.structure.ts`

### Frontend Query Pattern

Queries live in `apps/frontend/src/server/queries/` and use `defineQuery()` from next-sanity. Type generation runs automatically on pre-commit when `.schema.ts` or `.query.ts` files change.

### Pre-commit Hooks

Lefthook runs on pre-commit:
- Biome check with auto-fix on staged files
- Type generation when schema or query files change

If you modify `lefthook.yml`, run `pnpm lefthook install` to update git hooks.
