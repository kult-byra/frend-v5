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

---

# WCAG 2.1 Level AA & SEO Best Practices

## Accessibility (WCAG 2.1 Level AA)

### Keyboard Navigation
- All functionality must be operable via keyboard alone
- Test using Tab, Shift+Tab, and Enter keys

### Semantic HTML
- Use semantic tags: `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`
- Use logical heading order (H1, H2, H3) - each page should have a single H1

### Color Contrast
- Text/background: at least 4.5:1 for normal text, 3:1 for large text

### Images
- Provide descriptive `alt` attributes for all images
- Decorative images: use empty `alt=""`

### Forms
- Label all form fields clearly
- Provide instructions and error messages in text
- Allow users to review and correct input before submission

### ARIA
- Use ARIA attributes for dynamic content: `aria-label`, `aria-live`, `aria-hidden`

### Mobile
- Ensure interactive elements are accessible on touch devices
- Avoid horizontal scrolling, use responsive layouts

## SEO Best Practices

### Metadata
- Every page must have unique, descriptive `<title>` and meta description
- Include target keywords where relevant

### Structure
- Use headings to structure content with keywords
- Link from high-authority pages to those needing visibility
- Use descriptive anchor text for links

### Performance
- Minify CSS/JS, enable lazy loading for images
- Use GZIP compression and CDNs
- Optimize Core Web Vitals: LCP, FID, CLS

### Images
- Use descriptive file names and alt text
- Compress images, use WebP or AVIF formats

## Checklist

- [ ] All images have descriptive alt text
- [ ] Headings follow logical order (H1, H2, H3)
- [ ] Navigation is consistent and keyboard-accessible
- [ ] Forms have labels, instructions, and clear error messages
- [ ] Pages have unique, keyword-rich titles and meta descriptions
- [ ] Site loads quickly and is mobile-friendly
