---
description: When building archive pages, lists with pagination, or infinite scroll
globs:
alwaysApply: false
---

# Archive Pages with SEO-Friendly Pagination

## Principles

- **URL-based pagination** for SEO (`?page=2` is crawlable)
- **Server-rendered initial data** for fast first paint
- **Type-safe URL state** with nuqs
- **Proper metadata** (canonical URLs, pagination links)
- **Skeleton loading states** for smooth UX

## Required Package

```bash
pnpm add nuqs
```

## Pattern Overview

1. Define search params schema with nuqs
2. Fetch paginated data on server
3. Pass initial data to client component
4. Client syncs with URL via nuqs
5. Generate proper SEO metadata

## Complete Example

### 1. Search Params Configuration

```typescript
// lib/search-params/articles.search-params.ts
import { parseAsInteger, createSearchParamsCache } from 'nuqs/server'

export const ARTICLES_PER_PAGE = 12

export const articlesSearchParams = {
  page: parseAsInteger.withDefault(1),
}

export const articlesParamsCache = createSearchParamsCache(articlesSearchParams)
```

### 2. Page Component (Server)

```tsx
// app/(site)/artikler/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { articlesParamsCache, ARTICLES_PER_PAGE } from '@/lib/search-params/articles.search-params'
import { ArticleArchive } from './(parts)/article-archive.component'
import { ArticleArchiveSkeleton } from './(parts)/article-archive-skeleton.component'

type Props = {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page } = await articlesParamsCache.parse(searchParams)
  const baseUrl = 'https://example.com/artikler'

  return {
    title: page > 1 ? `Artikler - Side ${page}` : 'Artikler',
    alternates: {
      canonical: page === 1 ? baseUrl : `${baseUrl}?page=${page}`,
    },
  }
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { page } = await articlesParamsCache.parse(searchParams)

  return (
    <main className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Artikler</h1>
      <Suspense fallback={<ArticleArchiveSkeleton />}>
        <ArticleArchive initialPage={page} />
      </Suspense>
    </main>
  )
}
```

### 3. Archive Component with Cached Data

```tsx
// app/(site)/artikler/(parts)/article-archive.component.tsx
import { cacheLife } from 'next/cache'
import { sanityFetch } from '@/server/sanity/client'
import { articleArchiveQuery } from '@/server/queries/documents/article-archive.query'
import { ARTICLES_PER_PAGE } from '@/lib/search-params/articles.search-params'
import { ArticleGrid } from './article-grid.component'
import { Pagination } from '@/components/pagination.component'

type Props = {
  initialPage: number
}

export async function ArticleArchive({ initialPage }: Props) {
  'use cache'
  cacheLife('hours')

  const offset = (initialPage - 1) * ARTICLES_PER_PAGE
  
  const { articles, total } = await sanityFetch({
    query: articleArchiveQuery,
    params: {
      offset,
      limit: ARTICLES_PER_PAGE,
    },
  })

  const totalPages = Math.ceil(total / ARTICLES_PER_PAGE)

  return (
    <>
      <ArticleGrid articles={articles} />
      <Pagination 
        currentPage={initialPage} 
        totalPages={totalPages}
        basePath="/artikler"
      />
    </>
  )
}
```

### 4. Pagination Component

```tsx
// components/pagination.component.tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  currentPage: number
  totalPages: number
  basePath: string
}

export const Pagination = ({ currentPage, totalPages, basePath }: Props) => {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => 
    page === 1 ? basePath : `${basePath}?page=${page}`

  return (
    <nav aria-label="Pagination" className="flex justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          rel="prev"
        >
          Forrige
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={cn(
            'px-4 py-2 border rounded',
            page === currentPage
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-gray-100'
          )}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          rel="next"
        >
          Neste
        </Link>
      )}
    </nav>
  )
}
```

### 5. Skeleton Component

```tsx
// app/(site)/artikler/(parts)/article-archive-skeleton.component.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { ARTICLES_PER_PAGE } from '@/lib/search-params/articles.search-params'

export const ArticleArchiveSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: ARTICLES_PER_PAGE }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
)
```

### 6. GROQ Query with Pagination

```typescript
// server/queries/documents/article-archive.query.ts
import { defineQuery } from 'next-sanity'

export const articleArchiveQuery = defineQuery(`{
  "articles": *[_type == "article"] | order(publishedAt desc) [$offset...$offset + $limit] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt
  },
  "total": count(*[_type == "article"])
}`)
```

## SEO Considerations

1. **Canonical URLs**: First page uses base URL, others include `?page=X`
2. **rel="prev/next"**: Add to pagination links
3. **aria-current="page"**: Mark current page for accessibility
4. **Crawlable pagination**: All pages accessible via links
5. **No duplicate content**: Canonical prevents indexing issues

## Infinite Scroll (Optional)

For infinite scroll that maintains SEO:

1. Render first page server-side
2. Load more updates URL with nuqs
3. Keep pagination links for crawlers

```tsx
'use client'

import { useQueryState, parseAsInteger } from 'nuqs'

export function useArticlePagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  
  const loadMore = () => setPage(page + 1)
  
  return { page, loadMore }
}
```

