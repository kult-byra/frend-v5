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

### Max Width

Page content is constrained to **1920px** maximum width.

- **Main content area**: `<main>` element has `max-w-[1920px]` applied at root layout level
- **Header**: Full-width (fixed position), content uses its own padding
- **Footer**: Full-width background (outside main constraint), content uses `Container` for 1920px + xs padding
- **Page sections**: Handle their own horizontal padding with `px-xs` or `px-(--margin)`

### Tailwind Implementation

```tsx
// Root layout (main element constrained, header/footer full-width)
<main className="mx-auto w-full max-w-[1920px]">
  {children}
</main>

// Page sections (handle their own padding)
<section className="bg-container-primary">
  <div className="mx-auto max-w-[1920px] px-(--margin)">
    {/* content */}
  </div>
</section>

// Container component (for sections within pages)
<Container>  {/* max-w-[1920px] mx-auto px-xs */}

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

Semantic spacing scale registered as Tailwind theme variables. Use directly as `p-xs`, `gap-md`, `mt-2xl`, etc.

| Token         | Tailwind Class | Pixels |
| ------------- | -------------- | ------ |
| `spacing-3xs` | `p-3xs` / `gap-3xs` | 4px    |
| `spacing-2xs` | `p-2xs` / `gap-2xs` | 8px    |
| `spacing-xs`  | `p-xs` / `gap-xs`   | 16px   |
| `spacing-sm`  | `p-sm` / `gap-sm`   | 24px   |
| `spacing-md`  | `p-md` / `gap-md`   | 40px   |
| `spacing-lg`  | `p-lg` / `gap-lg`   | 56px   |
| `spacing-xl`  | `p-xl` / `gap-xl`   | 80px   |
| `spacing-2xl` | `p-2xl` / `gap-2xl` | 120px  |
| `spacing-3xl` | `p-3xl` / `gap-3xl` | 160px  |
| `spacing-4xl` | `p-4xl` / `gap-4xl` | 240px  |

### Usage Examples

```tsx
// Padding
<div className="p-xs">          {/* 16px padding */}
<div className="px-sm py-md">   {/* 24px horizontal, 40px vertical */}

// Margin
<section className="mt-2xl">    {/* 120px top margin */}

// Gap
<div className="flex gap-xs">   {/* 16px gap */}
<div className="grid gap-sm">   {/* 24px gap */}
```

### Usage Guidelines

- **3xs-xs**: Tight spacing for inline elements, icons, small gaps
- **sm-md**: Component internal spacing, card padding
- **lg-xl**: Section spacing, larger component gaps
- **2xl-4xl**: Page section separators, hero spacing

---

## Colors

> **IMPORTANT: Always use semantic color tokens, NEVER use primitive colors directly.**
>
> When writing styles, use semantic roles like `text-primary`, `bg-container-brand-1`, `border-stroke-soft` instead of primitives like `text-black`, `bg-white`, or hex values. Semantic tokens ensure consistency and make theme changes easier.
>
> **Wrong:** `bg-black`, `text-white`, `bg-[#FC5000]`
> **Correct:** `bg-container-brand-1`, `text-text-white-primary`, `bg-button-primary-hover`

### Primitive Colors (Reference Only)

Base color palette - **for reference only, do not use directly in code**:

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

### CTA Arrow Buttons

Small circular buttons with arrow icons, commonly used in cards and list items:

| Variant  | Background           | Icon Color              | Hover Background         | Hover Icon        | Usage                             |
| -------- | -------------------- | ----------------------- | ------------------------ | ----------------- | --------------------------------- |
| Primary  | `container-brand-1`  | `text-white-primary`    | `button-primary-hover`   | `text-primary`    | Desktop cards, primary CTAs       |
| Inverted | `container-primary`  | `text-primary`          | `container-tertiary-1`   | `text-primary`    | Mobile/list views, light contexts |

**Sizing:** 32px (8 Tailwind units)

**Implementation:**

```tsx
// Primary (dark background, white icon → orange background, dark icon on hover) - desktop cards
<div className="flex size-8 items-center justify-center rounded-full bg-container-brand-1 transition-colors group-hover:bg-button-primary-hover">
  <Icon name="arrow-right" className="size-[10px] text-text-white-primary transition-colors group-hover:text-text-primary" />
</div>

// Inverted (white background, dark icon) - mobile/list views
<div className="flex size-8 items-center justify-center rounded-full bg-container-primary group-hover:bg-container-tertiary-1">
  <Icon name="arrow-right" className="size-[10px] text-text-primary" />
</div>
```

**When to use which variant:**

- **Primary**: On cards in grid view, darker contexts, or when the button should stand out
- **Inverted**: On compact list items, mobile views, or lighter card designs where a softer button is preferred

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

---

## Icons & Illustrations

### UI Icons

Small functional icons used in UI components (buttons, navigation, forms).

**Available icons:**

| Name | Usage |
|------|-------|
| `arrow-right` | Link arrows, next actions |
| `arrow-top-right` | External links |
| `chevron-down` | Dropdowns, expand |
| `chevron-up` | Collapse, scroll up |
| `chevron-left` | Previous, back |
| `chevron-right` | Next, forward |
| `checkmark` | Checkboxes, success |
| `close` | Close modals, dismiss |
| `close-small` | Smaller close buttons |
| `collapse` | Collapse sections |
| `expand` | Expand sections |
| `play` | Video play |
| `pause` | Video pause |
| `star` | Ratings, favorites |
| `bullet` | List markers |

**Usage:**

```tsx
import { Icon } from "@/components/icon.component";

<Icon name="arrow-right" />
<Icon name="chevron-down" size="sm" />
<Icon name="close" size="md" label="Close" />
```

**Sizes:**

| Size | Description |
|------|-------------|
| `font` | Inherits current font size (default) |
| `xs` | 12px (0.75rem) |
| `sm` | 16px (1rem) |
| `md` | 20px (1.25rem) |
| `lg` | 24px (1.5rem) |
| `xl` | 28px (1.75rem) |

**Files location:** `apps/frontend/svg-icons/` (source), `apps/frontend/public/icons/sprite.svg` (generated)

---

### Illustrations

Frend's icons follow the general identity and contain elements and figures to help Frend explain processes and methods in an informative and graphic way. The style of icons and illustrations follows the visual style of the identity. All illustrations and icons are delivered in positive and negative color versions.

### Types

| Type | Description |
|------|-------------|
| `illustration` | Large, detailed graphics for hero sections and feature highlights |
| `icon` | Simple, recognizable symbols for UI elements |
| `area-icon` | Service area icons representing different business domains |

### Background Modes

All illustrations and icons come in variants for different background colors:

| Mode | File Prefix | Structural Color | Best On |
|------|-------------|------------------|---------|
| `light` | `light-*` | Dark purple (`#0B0426`) | White/light backgrounds (`#FFFFFF`) |
| `dark` | `dark-*` | Fresh purple (`#875EFF`) | Dark purple backgrounds (`#0B0426`) |

### Color Palette in SVGs

| Color | Hex | Usage |
|-------|-----|-------|
| Orange | `#FF4F00` | Primary accent, always present |
| Dark Purple | `#0B0426` | Structural elements (light mode) |
| Fresh Purple | `#875EFF` | Structural elements (dark mode) |
| Light Purple | `#EAC6FB` | Secondary accent, shadows |
| Near Black | `#040022` | Outlines (dark mode area icons) |

### Area Icons

Area icons represent Frend's service categories. Each category has three variants for different backgrounds:

| Suffix | Mode | Background |
|--------|------|------------|
| `-01` | `light` | Light backgrounds (`#FFFFFF`) |
| `-02` | `dark` | Dark backgrounds (`#0B0426`) |
| `-03` | `dark` | Dark backgrounds (`#0B0426`) - alternative style |

**Categories:**

| Category | Label |
|----------|-------|
| `crm` | CRM |
| `ai` | Generativ AI |
| `service` | Service |
| `teknologi` | Teknologi |
| `utvikler` | Utvikler |
| `nocode` | No-code/Low-code |

### Usage

```tsx
import { Illustration, type IllustrationName } from "@/components/illustration.component";

// Render an illustration
<Illustration name="light-collaboration" />

// Area icon for a service
<Illustration name="light-area-crm-01" />
```

**Files location:** `apps/frontend/public/illustrations/`

**Configuration:** `apps/studio/src/utils/illustrations.const.ts`
