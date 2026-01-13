---
description: When creating new features, components, or working with Sanity types and queries
globs:
alwaysApply: false
---

# Type-First Development Workflow

## Core Principle

Never manually write data types. All types are derived from GROQ queries via typegen.

## Feature Development Workflow

### 1. Update Sanity schema (if needed)

Modify schemas in `apps/studio/src/schemas/`

### 2. Create/update queries

- Location: `apps/frontend/src/server/queries/`
- Use `defineQuery` from `next-sanity`

### 3. For nested/reusable types (cards, teasers, fragments)

Create a typegen-only query with underscore prefix:

```typescript
import { defineQuery } from "next-sanity";
import type { ArticleTeaserTypegenQueryResult } from "@/sanity-types";

// @sanity-typegen-ignore
export const articleTeaserQuery = defineQuery(`
  _id,
  _type,
  title,
  "slug": slug.current,
`);

// For typegen only - underscore prefix prevents unused variable lint error
const _articleTeaserTypegenQuery = defineQuery(`
  *[_type == "article"][0]{
    ${articleTeaserQuery}
  }
`);

export type ArticleTeaserProps = NonNullable<ArticleTeaserTypegenQueryResult>;
```

### 4. Run typegen

```bash
pnpm typegen
```

### 5. Derive component types

Use TypeScript utility types to extract what you need:

| Pattern | Use Case |
|---------|----------|
| `NonNullable<T>` | Remove null from query result |
| `T[number]` | Get array item type |
| `T["fieldName"]` | Extract nested object type |

Example:

```typescript
import type { PageBuilderTypegenQueryResult } from "@/sanity-types";

// Array of blocks
export type PageBuilderType = NonNullable<PageBuilderTypegenQueryResult>;

// Single block
export type SingleBlockType = PageBuilderType[number];

// Extract specific block type
export type CallToActionBlock = Extract<SingleBlockType, { _type: "callToAction.block" }>;
```

### 6. Implement component

Import the derived type and use it for props:

```typescript
import type { ArticleTeaserProps } from "@/server/queries/teasers/article-teaser.query";

type Props = {
  article: ArticleTeaserProps;
};

export const ArticleTeaser = ({ article }: Props) => {
  // article is fully typed from the query
};
```

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

