# Archive Pages with SEO-Friendly Pagination

## Principles

- **URL-based pagination** for SEO (`?page=2` is crawlable)
- **Server-rendered initial data** for fast first paint
- **Type-safe URL state** with nuqs
- **Proper metadata** (canonical URLs, pagination links)
- **Skeleton loading states** for smooth UX

## SEO Considerations

1. **Canonical URLs**: First page uses base URL, others include `?page=X`
2. **rel="prev/next"**: Add to pagination links
3. **aria-current="page"**: Mark current page for accessibility
4. **Crawlable pagination**: All pages accessible via links
5. **No duplicate content**: Canonical prevents indexing issues
