# Container Queries with Tailwind CSS

## When to Use

- Building reusable UI components for different contexts
- Component needs to adapt to parent container size, not viewport
- Component may appear in sidebars, modals, or main content areas

## When NOT to Use

- Adjusting global page layout or navigation (use media queries)
- Container size depends on content (risk of collapse)
- Simple viewport-based changes are sufficient

## Basic Usage (Tailwind v4 - Built-in)

```html
<div class="@container">
  <div class="block @lg:flex">
    <!-- Adapts when container reaches lg breakpoint -->
  </div>
</div>
```

## Available Breakpoints

| Prefix | Min-width |
|--------|-----------|
| `@xs` | 20rem |
| `@sm` | 24rem |
| `@md` | 28rem |
| `@lg` | 32rem |
| `@xl` | 36rem |
| `@2xl` | 42rem |
| `@3xl` | 48rem |

## Max-width Queries

```html
<div class="@container">
  <div class="grid grid-cols-3 @max-md:grid-cols-1">
    <!-- 3 columns normally, 1 when container < md -->
  </div>
</div>
```

## Named Containers

For complex nested scenarios:

```html
<div class="@container/main">
  <div class="@container/sidebar">
    <div class="block @lg/main:flex @md/sidebar:grid">
      <!-- Responds to specific named containers -->
    </div>
  </div>
</div>
```

## Critical Rules

1. **DO NOT** make layout elements (grids, flex parents) into containers
2. **DO** use dedicated container wrapper elements

```html
<!-- Wrong -->
<div class="grid @container">
  <div class="@lg:flex">Component</div>
</div>

<!-- Correct -->
<div class="grid">
  <div class="@container">
    <div class="@lg:flex">Component</div>
  </div>
</div>
```

## Example Component

```tsx
export const ContentCard = ({ title, image, excerpt }) => (
  <article className="@container h-full">
    <div className="flex flex-col @lg:grid @lg:grid-cols-2 @lg:gap-6">
      {image && (
        <div className="h-48 @lg:h-full">
          <img src={image} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 @lg:p-8">
        <h3 className="text-lg @lg:text-xl font-medium">{title}</h3>
        {excerpt && <p className="text-sm @lg:text-base mt-3">{excerpt}</p>}
      </div>
    </div>
  </article>
);
```
