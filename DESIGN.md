# Design System

This document defines the design tokens and patterns for the Frend project. Claude should follow these specifications when writing styles.

---

## Grids

Two grid configurations based on viewport size:

### `grid-small` (Mobile & Tablet)

| Breakpoint | Range         | Columns | Gutter | Margin |
| ---------- | ------------- | ------- | ------ | ------ |
| mobile     | 320px - 425px | 6       | 16px   | 16px   |
| tablet     | 426px - 1024px| 6       | 16px   | 16px   |

### `grid-large` (Desktop & Display)

| Breakpoint | Range            | Columns | Gutter | Margin |
| ---------- | ---------------- | ------- | ------ | ------ |
| desktop    | 1025px - 1440px  | 12      | 16px   | 16px   |
| display    | 1441px - 2560px  | 12      | 16px   | 16px   |

### Tailwind Implementation

```tsx
// Container with responsive margins
<div className="mx-4">  {/* 16px margin on all breakpoints */}

// Grid layouts
<div className="grid grid-cols-6 gap-4 lg:grid-cols-12">
  {/* 6 columns on mobile/tablet, 12 on desktop+ */}
  {/* gap-4 = 16px gutter */}
</div>
```

### Breakpoint Reference

| Name    | Min Width | Tailwind Prefix |
| ------- | --------- | --------------- |
| mobile  | 320px     | (default)       |
| tablet  | 426px     | `sm:` or custom |
| desktop | 1025px    | `lg:`           |
| display | 1441px    | `2xl:` or custom|

---

## Spacing

Semantic spacing scale with corresponding pixel values:

| Token         | Value   | Pixels |
| ------------- | ------- | ------ |
| `spacing-3xs` | `spacing-4`   | 4px    |
| `spacing-2xs` | `spacing-8`   | 8px    |
| `spacing-xs`  | `spacing-16`  | 16px   |
| `spacing-sm`  | `spacing-24`  | 24px   |
| `spacing-md`  | `spacing-40`  | 40px   |
| `spacing-lg`  | `spacing-56`  | 56px   |
| `spacing-xl`  | `spacing-80`  | 80px   |
| `spacing-2xl` | `spacing-120` | 120px  |
| `spacing-3xl` | `spacing-160` | 160px  |
| `spacing-4xl` | `spacing-240` | 240px  |

### Tailwind Mapping

| Token         | Tailwind Class |
| ------------- | -------------- |
| `spacing-3xs` | `p-1` / `gap-1` (4px) |
| `spacing-2xs` | `p-2` / `gap-2` (8px) |
| `spacing-xs`  | `p-4` / `gap-4` (16px) |
| `spacing-sm`  | `p-6` / `gap-6` (24px) |
| `spacing-md`  | `p-10` / `gap-10` (40px) |
| `spacing-lg`  | `p-14` / `gap-14` (56px) |
| `spacing-xl`  | `p-20` / `gap-20` (80px) |
| `spacing-2xl` | `p-[120px]` / `gap-[120px]` |
| `spacing-3xl` | `p-[160px]` / `gap-[160px]` |
| `spacing-4xl` | `p-[240px]` / `gap-[240px]` |

### Usage Guidelines

- **3xs-xs**: Tight spacing for inline elements, icons, small gaps
- **sm-md**: Component internal spacing, card padding
- **lg-xl**: Section spacing, larger component gaps
- **2xl-4xl**: Page section separators, hero spacing

---

## Colors

### Primitive Colors

Base color palette with hex values:

| Token                          | Hex       | Description              |
| ------------------------------ | --------- | ------------------------ |
| `colour-dark-purple`           | `#0B0426` | Primary brand color      |
| `colour-white`                 | `#FFFFFF` | White                    |
| `colour-orange`                | `#FC5000` | Accent/CTA color         |
| `colour-light-orange`          | `#FFCFB9` | Light orange tint        |
| `colour-light-purple`          | `#E1C5F9` | Light purple tint        |
| `colour-green`                 | `#14B046` | Success/positive         |
| `colour-red`                   | `#FF6060` | Error/negative           |
| `colour-yellow`                | `#FFB23C` | Warning                  |
| `colour-fresh-purple`          | `#875EFF` | Accent purple            |
| `colour-error`                 | `#BA1E1E` | Error state              |

### Tinted Variants

| Token                          | Base      | Opacity   |
| ------------------------------ | --------- | --------- |
| `colour-red-10%`               | `#FFEFEF` | 10%       |
| `colour-red-5%`                | `#FFF7F7` | 5%        |
| `colour-yellow-10%`            | `#FFF7EB` | 10%       |
| `colour-yellow-7%`             | `#FFFAF1` | 7%        |
| `colour-fresh-purple-10%`      | `#F3EFFF` | 10%       |
| `colour-fresh-purple-5%`       | `#F9F7FF` | 5%        |
| `colour-green-10%`             | `#E7F6EC` | 10%       |
| `colour-green-5%`              | `#F3FBF6` | 5%        |
| `colour-dark-purple-opacity-4%`| `#0B0426` | 4%        |
| `colour-dark-purple-opacity-10%`| `#0B0426`| 10%       |
| `colour-dark-purple-opacity-65%`| `#0B0426`| 65%       |
| `colour-white-opacity-10%`     | `#FFFFFF` | 10%       |
| `colour-white-opacity-30%`     | `#FFFFFF` | 30%       |
| `colour-white-opacity-65%`     | `#FFFFFF` | 65%       |

### Semantic Roles - Text

| Token                  | Value                              |
| ---------------------- | ---------------------------------- |
| `text-primary`         | `colour-dark-purple`               |
| `text-secondary`       | `colour-dark-purple-opacity-65%`   |
| `text-white-primary`   | `colour-white`                     |
| `text-white-secondary` | `colour-white-opacity-65%`         |

### Semantic Roles - Containers

| Token                          | Value                              |
| ------------------------------ | ---------------------------------- |
| `container-primary`            | `colour-white`                     |
| `container-secondary`          | `colour-fresh-purple-10%`          |
| `container-tertiary-1`         | `colour-red-10%`                   |
| `container-tertiary-2`         | `colour-yellow-10%`                |
| `container-tertiary-3`         | `colour-green-10%`                 |
| `container-brand-1`            | `colour-dark-purple`               |
| `container-brand-2`            | `colour-orange`                    |
| `container-shade`              | `colour-dark-purple-opacity-4%`    |
| `container-overlay-primary-1`  | `colour-light-purple`              |
| `container-overlay-primary-2`  | `colour-light-orange`              |
| `container-overlay-secondary-1`| `colour-green`                     |
| `container-overlay-secondary-2`| `colour-red`                       |
| `container-overlay-secondary-3`| `colour-yellow`                    |
| `container-overlay-secondary-4`| `colour-fresh-purple`              |
| `container-overlay-tint`       | `colour-white-opacity-30%`         |

### Semantic Roles - Buttons

| Token                           | Value                  |
| ------------------------------- | ---------------------- |
| `buttons-primary-fill`          | `colour-dark-purple`   |
| `buttons-primary-text`          | `colour-white`         |
| `buttons-primary-fill-hover`    | `colour-orange`        |
| `buttons-primary-inverted-fill` | `colour-white`         |
| `buttons-primary-inverted-fill-hover` | `colour-orange`  |
| `buttons-primary-inverted-text` | `colour-dark-purple`   |
| `buttons-secondary-stroke`      | `colour-dark-purple`   |
| `buttons-secondary-stroke-hover`| `colour-orange`        |
| `buttons-secondary-text`        | `colour-dark-purple`   |
| `buttons-secondary-text-hover`  | `colour-orange`        |

### Semantic Roles - Strokes

| Token                 | Value                              |
| --------------------- | ---------------------------------- |
| `stroke-soft`         | `colour-dark-purple-opacity-10%`   |
| `stroke-full`         | `colour-dark-purple`               |
| `stroke-soft-inverted`| `colour-white-opacity-10%`         |
| `stroke-error`        | `colour-error`                     |

---

## Typography

### Font Families

| Token                | Font Family  | Weight | Usage                    |
| -------------------- | ------------ | ------ | ------------------------ |
| `suisse-intl-book`   | Suisse Int'l | 450    | Body text, general copy  |
| `suisse-intl-semibold` | Suisse Int'l | 600  | Headings, emphasis       |
| `dm-mono-regular`    | DM Mono      | 400    | Code, monospace text     |

> **Note**: Suisse Int'l is awaiting WOFF2 files. DM Mono is available via Google Fonts.

### Headings

Responsive heading styles with different sizes for small (mobile/tablet) and large (desktop) grids:

| Token        | Grid Small | Grid Large | Line Height | Letter Spacing | Font            |
| ------------ | ---------- | ---------- | ----------- | -------------- | --------------- |
| `headline-1` | 30px       | 42px       | 110%        | 0%             | suisse-intl-semibold |
| `headline-2` | 24px       | 28px       | 110%        | 0%             | suisse-intl-semibold |
| `headline-3` | 20px       | 20px       | 130%        | 0%             | suisse-intl-semibold |

### Body Text

| Token        | Font Size | Line Height | Letter Spacing | Font            |
| ------------ | --------- | ----------- | -------------- | --------------- |
| `body-title` | 16px      | 145%        | 0%             | suisse-intl-semibold |
| `body`       | 16px      | 145%        | 0%             | suisse-intl-book |
| `body-large` | 18px      | 150%        | 0%             | suisse-intl-book |
| `body-small` | 12px      | 145%        | 0%             | suisse-intl-book |
| `code`       | 16px      | 150%        | 0%             | dm-mono-regular |

### Tailwind Implementation

```tsx
// Headings (responsive)
<h1 className="text-[30px] lg:text-[42px] leading-[110%] font-semibold">
<h2 className="text-[24px] lg:text-[28px] leading-[110%] font-semibold">
<h3 className="text-[20px] leading-[130%] font-semibold">

// Body text
<p className="text-base leading-[145%]">              {/* body */}
<p className="text-base leading-[145%] font-semibold"> {/* body-title */}
<p className="text-lg leading-[150%]">                {/* body-large */}
<p className="text-xs leading-[145%]">                {/* body-small */}
<code className="font-mono text-base leading-[150%]"> {/* code */}
```

---

## Media

### Aspect Ratios

In almost all use cases, use one of these 3 media ratios:

| Ratio | Usage                              |
| ----- | ---------------------------------- |
| 3:2   | Landscape images, hero media       |
| 3:4   | Portrait images, cards             |
| 1:1   | Square images, avatars, thumbnails |

### Video Behavior

For looping video assets:
- The pause/play icon is always sticky in the bottom-left corner of the media
- Once the media is within the viewport, the pause icon is visible sticky to the bottom of the viewport, within the media container

---

## Buttons & Links

### CTA Buttons

Two main button variants with consistent hover behavior (fill changes to orange):

| Variant   | Default State                      | Hover State               |
| --------- | ---------------------------------- | ------------------------- |
| Primary   | Dark purple fill, white text       | Orange fill, white text   |
| Secondary | Transparent, dark purple border    | Orange border, orange text|

**Sizing:**

- Desktop: 39px height
- Mobile: 44px height (larger touch target)

### Link Styles

| Type           | Description                                    | Hover Behavior         |
| -------------- | ---------------------------------------------- | ---------------------- |
| Underline Link | Text with underline                            | Text turns orange      |
| External Link  | Text with arrow icon (↗)                       | Text turns orange      |
| Anchor Link    | Numbered item (e.g., "01 IT Service & Support")| Text turns orange      |

**Inverted variants** exist for all link types (white text on dark backgrounds).

### Tag Pills

Pill-shaped buttons used for filters and categories:

| Type     | States                                          |
| -------- | ----------------------------------------------- |
| Primary  | enabled, hover, active, selected (with ×)       |
| Inverted | enabled, hover, active, selected (with ×)       |

- Selected state includes a close (×) icon
- Hover state: orange border
- Active state: dark purple fill

### Media Controls

Icon buttons for media navigation and playback:

| Button           | Size (Desktop) | Size (Mobile) |
| ---------------- | -------------- | ------------- |
| Nav Left/Right   | 32px           | 48px          |
| Play/Pause       | 32px           | 48px          |
| Player Play/Pause| 60px           | —             |

All media buttons: hover state changes fill to orange.

---

## Form Elements

### Input Fields

Text input with floating label pattern:

| State       | Description                                      |
| ----------- | ------------------------------------------------ |
| enabled     | Empty field with label as placeholder            |
| hover       | Label becomes bold                               |
| active      | Label floats up, blue background tint            |
| value       | User typing, blue background                     |
| filled      | Value entered, label stays floated               |
| filled-auto | Browser autofill state                           |
| filled-pre  | Pre-filled value                                 |
| disabled    | Greyed out, non-interactive                      |
| error       | Red dashed border, error state                   |

**Sizing:** 60px height

### Message Field (Textarea)

Multi-line text input for longer content:

| State   | Description                        |
| ------- | ---------------------------------- |
| enabled | Empty with placeholder label       |
| hover   | Label becomes bold                 |
| active  | Blue background tint               |
| value   | User typing                        |
| filled  | Content entered                    |

**Sizing:** 120px height

### Dropdown Field

Select input with dropdown indicator:

| State   | Description                        |
| ------- | ---------------------------------- |
| enabled | Label with chevron                 |
| filled  | Selected value displayed           |

### Checkbox

Small checkbox for consent/options:

| State            | Description                        |
| ---------------- | ---------------------------------- |
| enabled          | Empty checkbox                     |
| selected         | Checkbox with checkmark            |
| disabled         | Greyed out empty                   |
| selected-disabled| Greyed out with checkmark          |

**Sizing:** 16px × 16px

### Accordion

Expandable content sections:

| State     | Description                                    |
| --------- | ---------------------------------------------- |
| collapsed | Title with chevron pointing down               |
| expanded  | Title with chevron pointing up, content visible|

Content can include body text, bullet lists, and text links.

---

## Brand Assets

### Logo

Use the `Logo` component from `@/components/logo.component.tsx`.

**Colors:**

| Color    | Usage                              |
| -------- | ---------------------------------- |
| `dark`   | On light backgrounds (default)     |
| `light`  | On dark/brand backgrounds          |
| `orange` | On dark backgrounds, accent use    |

**Variants:**

| Variant    | Description                        |
| ---------- | ---------------------------------- |
| `standard` | Horizontal "frend" wordmark        |
| `angled1`  | Angled layout (angle-left)         |
| `angled2`  | Angled layout (angle-right)        |

**Usage:**

```tsx
import { Logo } from "@/components/logo.component";

// Default (dark, standard)
<Logo />

// White logo on dark background
<Logo color="light" />

// Angled variant
<Logo variant="angled1" />

// Custom size
<Logo width={200} height={67} />
```

