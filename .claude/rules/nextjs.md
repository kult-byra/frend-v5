# Next.js Best Practices

## App Router Structure

- Use `page.tsx` files in route directories
- Client components must be explicitly marked with `'use client'`
- Use kebab-case for directory names, PascalCase for component files
- Prefer named exports over default exports

## Server vs Client Components

- Keep most components as React Server Components (RSC)
- Only use client components when you need interactivity
- Create small client component wrappers around interactive elements

## Cache Components (Next.js 16+)

Cache Components lets you mix static, cached, and dynamic content in a single route.

### Enable in next.config.ts:

```ts
const nextConfig = {
  cacheComponents: true,
}
```

### Three Content Types:

| Type | Description | How |
|------|-------------|-----|
| **Static** | Automatically prerendered | Pure computations, sync I/O |
| **Cached** | Included in static shell | `'use cache'` directive + `cacheLife` |
| **Dynamic** | Streams at request time | Wrap in `<Suspense>` with fallback |

### Pattern:

```tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'

// Cached - included in static shell, revalidates hourly
async function CachedArticles() {
  'use cache'
  cacheLife('hours')
  const articles = await fetchArticles()
  return <ArticleList articles={articles} />
}

// Dynamic - streams at request time (user-specific)
async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value
  return <p>Theme: {theme}</p>
}

// Page combines all three types
export default function Page() {
  return (
    <>
      <StaticHeader />           {/* Static shell */}
      <CachedArticles />         {/* Cached, in static shell */}
      <Suspense fallback={<PreferencesSkeleton />}>
        <UserPreferences />      {/* Streams at request time */}
      </Suspense>
    </>
  )
}
```

### When to Use Each:

- **Static**: Constants, computed values, sync operations
- **Cached (`use cache`)**: External data that can be stale (blog posts, products)
- **Dynamic (Suspense)**: User-specific data, real-time content, cookies/headers

### Cache Revalidation:

```ts
import { revalidateTag, revalidatePath } from 'next/cache'

// In server action or webhook
revalidateTag('articles')
revalidatePath('/blog')
```

## Suspense Usage

Use `<Suspense>` for:

- Deferring dynamic content to request time
- Lazy-loaded components with `React.lazy()`
- Streaming content that depends on cookies/headers

Do NOT use Suspense just to "wrap client components" - it's for async boundaries.

## State Management

- Use server components for data fetching
- Use React Server Actions for form handling
- Use URL search params for shareable state
- Use `nuqs` for type-safe URL state management

## Avoid Unnecessary Hooks

- Avoid `useState` when URL params or server state work
- Avoid `useEffect` for data fetching - use server components
- Avoid `useContext` when server components can pass props
