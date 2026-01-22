# Type-First Development Workflow

## Core Principle

Never manually write data types. All types are derived from GROQ queries via typegen.

## Feature Development Workflow

1. **Update Sanity schema** (if needed) - Modify schemas in `apps/studio/src/schemas/`
2. **Create/update queries** - Location: `apps/frontend/src/server/queries/`, use `defineQuery` from `next-sanity`
3. **For nested/reusable types** (cards, teasers, fragments) - Create a typegen-only query with underscore prefix
4. **Run typegen** - `pnpm typegen`
5. **Derive component types** - Use TypeScript utility types to extract what you need
6. **Implement component** - Import the derived type and use it for props

## Type Extraction Patterns

| Pattern | Use Case |
|---------|----------|
| `NonNullable<T>` | Remove null from query result |
| `T[number]` | Get array item type |
| `T["fieldName"]` | Extract nested object type |

## Query File Structure

```
apps/frontend/src/server/queries/
├── blocks/           # Page builder block queries
├── documents/        # Full document queries
├── teasers/          # Card/teaser fragment queries
├── settings/         # Site settings queries
└── utils/            # Shared query fragments (image, links, metadata)
```

## Task Completion

Finish all tasks with:

```bash
pnpm check && pnpm typecheck
```

Then suggest a commit message following conventional commits.
