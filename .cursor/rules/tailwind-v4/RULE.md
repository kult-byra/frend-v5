---
description: When configuring Tailwind or using advanced CSS features
globs:
alwaysApply: false
---

# Tailwind CSS v4

## Core Changes

- Use CSS-first configuration with `@theme` directive instead of `tailwind.config.js`
- Use `@import "tailwindcss"` instead of separate `@tailwind` directives
- Package names: `@tailwindcss/postcss`, `@tailwindcss/cli`, `@tailwindcss/vite`

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  --color-brand-500: oklch(0.84 0.18 117.33);
}
```

## CSS Variables

Use CSS variables for design tokens:

- `--color-*`: Colors
- `--font-*`: Font families
- `--text-*`: Font sizes
- `--spacing-*`: Spacing values
- `--radius-*`: Border radius

## Container Queries (Built-in)

No plugin needed in v4:

```html
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-3 @lg:grid-cols-4">
    <!-- Adapts based on container size -->
  </div>
</div>
```

Breakpoints: `@xs`, `@sm`, `@md`, `@lg`, `@xl`, `@2xl`, `@3xl`

Max-width: `@max-md:grid-cols-1`

## Breaking Changes

- Arbitrary CSS variables: Use `bg-(--brand-color)` not `bg-[--brand-color]`
- Renamed utilities: `shadow-xs`, `rounded-xs`, `blur-xs` (was `-sm`)

## Custom Utilities

```css
@utility tab-4 {
  tab-size: 4;
}

@variant pointer-coarse (@media (pointer: coarse));
```

