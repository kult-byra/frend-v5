---
description: When building card or teaser components
globs:
alwaysApply: false
---

# Card Structure & Accessibility

## Link Structure

- Only the title should be a link
- `h3` tags wrap outside `a` tags

```tsx
<article>
  <h3>
    <a href="/article-slug">Article Title</a>
  </h3>
  <p>Article description</p>
</article>
```

## Clickable Cards

Make entire card clickable using CSS pseudo-element:

```tsx
<article className="relative group">
  <h3>
    <a href="/article-slug" className="after:absolute after:inset-0">
      Article Title
    </a>
  </h3>
  <p>Article description</p>
</article>
```

## "Read More" Accessibility

Avoid generic "Les mer" text. If used, provide screen reader context:

```tsx
<a href="/article-slug">
  <span aria-hidden="true">Les mer</span>
  <span className="sr-only">Les mer om {article.title}</span>
</a>
```

## List Structure

Wrap cards in semantic list elements:

```tsx
<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {articles.map(article => (
    <li key={article._id}>
      <article className="relative group">
        <h3>
          <a href={`/articles/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </a>
        </h3>
        <p>{article.description}</p>
      </article>
    </li>
  ))}
</ul>
```

## Container Queries

Use container queries for responsive card layouts:

```tsx
<div className="@container">
  <article className="flex flex-col @lg:grid @lg:grid-cols-2">
    <h3><a href="/article-slug">Article Title</a></h3>
    <p>Article description</p>
  </article>
</div>
```

## Checklist

- [ ] Title is the only link
- [ ] `h3` wraps outside `a` tag
- [ ] Card is fully clickable via pseudo-element
- [ ] Hover effects are implemented
- [ ] "Read more" text has screen reader context
- [ ] Cards are wrapped in semantic list elements

