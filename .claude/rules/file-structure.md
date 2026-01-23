# File Structure & Component Organization

## Frontend Component Hierarchy

Components are organized in layers from most specific to most reusable:

### 1. Page Parts (`/app/[locale]/{route}/(parts)/`)

Route-specific layout orchestrators. **Not reusable outside their route.**

| Use when | Examples |
|----------|----------|
| Composing a page layout | `services-hero.component.tsx` |
| Route-specific responsive logic | `services-desktop-layout.component.tsx` |
| Page-level state management | `article-archive.component.tsx` |

**Naming**: `{feature}-{purpose}.component.tsx`

```
/app/[locale]/services/
├── (parts)/
│   ├── services-hero.component.tsx      # Hero for archive
│   ├── services-list.component.tsx      # List orchestrator
│   └── service-card.component.tsx       # Card in list context
└── [slug]/
    └── (parts)/
        ├── service-hero.component.tsx   # Hero for detail
        └── service.component.tsx        # Main content
```

### 2. Teasers (`/components/teasers/`)

Minimal, read-only display of a single item. Used in lists and archives.

| Characteristics | Example |
|-----------------|---------|
| No internal state | `article.teaser.tsx` |
| Single item display | `client.teaser.tsx` |
| Receives typed props from parent | `event.teaser.tsx` |

**Naming**: `{document-type}.teaser.tsx`

```tsx
// Teaser = minimal, just displays one item
export function ArticleTeaser({ article }: { article: ArticleTeaserData }) {
  return (
    <article>
      <h3><Link href={...}>{article.title}</Link></h3>
    </article>
  );
}
```

### 3. Block Cards (`/components/blocks/cards/`)

Rich collection displays for page builder blocks. Handle grids, variants, filtering.

| Characteristics | Example |
|-----------------|---------|
| Renders collections | `services.cards.component.tsx` |
| Multiple layout variants | `client.cards.component.tsx` |
| Used by page builder | `event.cards.component.tsx` |

**Naming**: `{document-type}.cards.component.tsx`

```tsx
// Cards = collection display with layout logic
export function ServicesCards({ items, variant }: ServicesCardsProps) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2">
      {items.map(item => <ServiceCard key={item._id} {...item} />)}
    </ul>
  );
}
```

### 4. Shared Components (`/components/`)

Truly reusable across multiple routes/features.

| Directory | Purpose | Examples |
|-----------|---------|----------|
| `/layout/` | Global layout elements | `header`, `footer`, `banner` |
| `/ui/` | shadcn/ui primitives | `button`, `form`, `input` |
| `/ui/parts/` | Composed UI patterns | `button-group` |
| `/utils/` | Helper components | `img`, `link-resolver` |
| `/portable-text/` | Rich text rendering | `portable-text`, `accordion` |
| `/blocks/` | Page builder blocks | `content.block`, `call-to-action.block` |

## Decision Tree: Where Does This Component Go?

```
Is it used ONLY on one route?
├── YES → /app/[locale]/{route}/(parts)/
└── NO → Is it a single-item display for lists?
    ├── YES → /components/teasers/
    └── NO → Is it a collection for page builder?
        ├── YES → /components/blocks/cards/
        └── NO → /components/{category}/
```

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | `{name}.component.tsx` | `header.component.tsx` |
| Page part | `{feature}-{purpose}.component.tsx` | `service-hero.component.tsx` |
| Teaser | `{type}.teaser.tsx` | `article.teaser.tsx` |
| Block card | `{type}.cards.component.tsx` | `client.cards.component.tsx` |
| Block | `{name}.block.component.tsx` | `content.block.component.tsx` |
| Hook | `use-{name}.hook.ts` | `use-active-anchor.hook.ts` |
| Utility | `{name}.util.ts` | `cn.util.ts` |
| Type file | `{name}.types.ts` | `portable-text.types.ts` |

## Query Organization

```
/server/queries/
├── documents/       # Full document queries (article.query.ts)
├── teasers/         # Card/list fragments (article-teaser.query.ts)
├── blocks/          # Page builder blocks
├── settings/        # Site settings
├── portable-text/   # Rich text queries
├── paths/           # SSG path generation
└── utils/           # Shared fragments (image.query.ts)
```

## Hook Extraction Guidelines

Extract to `/hooks/` when logic is:

- Used in multiple components
- Complex enough to benefit from isolation
- Testable in isolation

```tsx
// Before: Logic embedded in component
useEffect(() => {
  const observers: IntersectionObserver[] = [];
  // ... 30 lines of observer logic
}, [items]);

// After: Extracted hook
const activeId = useActiveAnchor(items);
```

## Client vs Server Components

- Default to Server Components
- Use `"use client"` only when needed:
  - Event handlers (`onClick`, `onChange`)
  - Hooks (`useState`, `useEffect`)
  - Browser APIs (`IntersectionObserver`, `localStorage`)
- Create small client wrappers around interactive parts
