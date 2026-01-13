---
description: When creating pages, forms, or reviewing accessibility
globs:
alwaysApply: false
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

