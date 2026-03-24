# DevToolbox Design System Foundation

**Version:** 2.0  
**Date:** March 23, 2026  
**Status:** Active  
**Related Docs:** [UTILITY_CLASS_SYSTEM.md](./UTILITY_CLASS_SYSTEM.md), [UX_DESIGN_SYSTEM.md](./UX_DESIGN_SYSTEM.md)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Utility Class System (v2)](#utility-class-system-v2)
4. [Theme System](#theme-system)
5. [Color Palette](#color-palette)
6. [Typography System](#typography-system)
7. [Material Symbols Integration](#material-symbols-integration)
8. [Spacing & Layout](#spacing--layout)
9. [Heritage Design Patterns](#heritage-design-patterns)
10. [Browser Compatibility](#browser-compatibility)

---

## Overview

The DevToolbox Design System Foundation defines the visual language, interaction patterns, and technical implementation standards for the entire platform. Version 2.0 introduces a modern utility-first approach while maintaining the cultural "Heritage Evolution" aesthetic.

### Core Principles

1. **Zero Dependencies** - Vanilla CSS, no frameworks required
2. **Privacy-First** - All tools run locally in the browser
3. **Accessibility** - WCAG 2.1 AA/AAA compliance
4. **Performance** - <3s page load, <50KB CSS
5. **Cultural Expression** - Dual themes with Indic design influences

### Architecture

```
HTML (Utility Classes)
    ↓
CSS Custom Properties (Design Tokens)
    ↓
Theme System (Light/Dark)
    ↓
Browser Rendering
```

---

## Design Philosophy

### Heritage Evolution

The design system embodies "Heritage Evolution" - a fusion of traditional Indic design elements with contemporary web aesthetics:

**Light Mode: "Indic Futurism"**
- Warm, organic color palette (terracotta, honey gold)
- Soft shadows and arch border-radius
- Inspired by traditional architecture and textiles

**Dark Mode: "Neon Heritage"**
- Vibrant cyberpunk aesthetic (neon orange, cyan)
- Sharp geometries and glowing effects
- Modern interpretation of festival lighting

### Dual Expression

Both themes share the same component structure and utility classes but express distinct visual personalities:

```html
<!-- Same markup, different appearance based on theme -->
<div class="bg-surface-light dark:bg-surface-dark 
            theme-image-radius theme-shadow 
            border border-muted-light/20 dark:border-accent-dark/30">
  <!-- Content -->
</div>
```

---

## Utility Class System (v2)

### Overview

DevToolbox v2 adopts a Tailwind-inspired utility-first CSS approach implemented in vanilla CSS. This provides modern developer experience without build tooling or external dependencies.

**Key Benefits:**
- **Composition:** Build UIs by composing small, single-purpose classes
- **Consistency:** Enforces design token usage automatically
- **Responsiveness:** Mobile-first with `md:` and `lg:` breakpoints
- **Maintainability:** Easier to iterate and refactor

### Quick Reference

**Full Documentation:** [UTILITY_CLASS_SYSTEM.md](./UTILITY_CLASS_SYSTEM.md)

#### Common Layout Utilities

```css
/* Display & Flexbox */
.flex, .grid, .block, .hidden
.flex-col, .flex-row, .items-center, .justify-between
.gap-{0-12}

/* Grid Systems */
.grid-cols-{1-12}, .md:grid-cols-{2-4}, .lg:grid-cols-{3-4}

/* Positioning */
.relative, .absolute, .fixed, .sticky
.inset-0, .top-0, .z-{10-50}
```

#### Common Spacing Utilities

```css
/* Padding (8px grid) */
.p-{0,1,2,3,4,6,8,10,12}
.px-{2,4,6,8,10,40}, .py-{2,3,4,5,6,8}
.pt-{2,3,4}, .pb-{1,3,6}

/* Margin */
.m-{0,1,2,4,auto}, .mx-auto, .my-{2,4}
.mt-{2,4,6,8}, .mb-{2,4,6,8}
```

#### Common Typography Utilities

```css
/* Font Families */
.font-heading      /* Rozha One - for titles */
.font-display      /* Plus Jakarta Sans - for UI */
.font-mono         /* Monaco - for code */

/* Sizes (Responsive) */
.text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl,6xl}
.md:text-{lg,xl,2xl,5xl,6xl}
.lg:text-6xl

/* Weight & Style */
.font-{light,normal,medium,semibold,bold}
.uppercase, .capitalize, .tracking-wide
```

#### Common Color Utilities

```css
/* Backgrounds (Theme-Aware) */
.bg-background-light   .dark:bg-background-dark
.bg-surface-light      .dark:bg-surface-dark
.bg-primary            .dark:bg-primary-dark

/* Text Colors */
.text-text-light       .dark:text-text-dark
.text-muted-light      .dark:text-muted-dark
.text-primary          .dark:text-primary-dark

/* Borders */
.border-muted-light/20     .dark:border-muted-dark/30
.border-accent-light/30    .dark:border-accent-dark/30
```

#### Common Effect Utilities

```css
/* Shadows */
.shadow-{none,sm,md,lg,xl}
.shadow-card-light     .dark:shadow-card-dark

/* Transitions */
.transition-{all,colors,opacity,transform}
.duration-{75,150,300}
.hover:scale-{90,95,105,110}

/* Opacity */
.opacity-{0,50,100}
.hover:opacity-100
```

### Usage Pattern

**Example: Responsive Tool Card**

```html
<article class="
  flex flex-col gap-4 p-6
  bg-surface-light dark:bg-surface-dark
  border border-muted-light/20 dark:border-accent-dark/30
  theme-image-radius theme-shadow
  transition-all duration-300
  hover:scale-105 hover:-translate-y-2
  md:flex-row md:gap-6
">
  <div class="aspect-[16/9] overflow-hidden theme-image-radius">
    <img src="..." class="w-full h-full object-cover" />
  </div>
  <div class="flex flex-col gap-2">
    <h3 class="font-heading text-2xl md:text-3xl text-text-light dark:text-text-dark">
      JSON Schema Validator
    </h3>
    <p class="text-muted-light dark:text-muted-dark text-sm leading-relaxed line-clamp-2">
      Validate JSON against schemas with detailed error reporting.
    </p>
  </div>
</article>
```

---

## Theme System

### Class-Based Theming

DevToolbox v2 uses **class-based theme management** (industry standard):

```javascript
// Apply dark theme
document.documentElement.classList.add('dark');

// Apply light theme
document.documentElement.classList.remove('dark');
```

**NOT** the old `data-theme` attribute approach:
```javascript
// ❌ OLD (v1) - Don't use this
document.documentElement.setAttribute('data-theme', 'dark');
```

### localStorage Key

Theme preference is stored with the key: `devtoolbox_theme`

```javascript
// Save theme
localStorage.setItem('devtoolbox_theme', 'dark');

// Read theme
const savedTheme = localStorage.getItem('devtoolbox_theme');
```

### FOUC Prevention

All HTML files include an inline script in `<head>` to prevent Flash of Unstyled Content:

```html
<script>
  // FOUC Prevention - Must run before body renders
  (function() {
    const savedTheme = localStorage.getItem('devtoolbox_theme');
    const prefersDark = window.matchMedia && 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  })();
</script>
```

### CSS Architecture

**Default Theme:** Dark (in `:root`)  
**Light Theme:** Applied via `.light` class

```css
/* Root: Dark theme defaults */
:root {
  --color-bg-primary: #08080C;
  --color-text-primary: #E8E9F3;
  /* ... other dark theme variables */
}

/* Light theme overrides */
.light {
  --color-bg-primary: #FDFBF7;
  --color-text-primary: #2D2A26;
  /* ... other light theme variables */
}
```

**Note:** Utility classes automatically use these CSS variables, so theme switching is instant and automatic.

---

## Color Palette

### Light Mode: "Indic Futurism"

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Primary | `#C84B31` | `200, 75, 49` | CTA buttons, links, primary actions |
| Accent | `#E3A857` | `227, 168, 87` | Highlights, badges, secondary elements |
| Background | `#FDFBF7` | `253, 251, 247` | Page background |
| Surface | `#F4EFE6` | `244, 239, 230` | Cards, panels, elevated content |
| Text | `#2D2A26` | `45, 42, 38` | Primary text content |
| Muted | `#9C9283` | `156, 146, 131` | Secondary text, descriptions |

**Inspiration:** Warm sandstone, terracotta architecture, traditional textiles

### Dark Mode: "Neon Heritage"

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Primary | `#FF6B35` | `255, 107, 53` | CTA buttons, links, primary actions |
| Accent | `#00F0FF` | `0, 240, 255` | Highlights, badges, borders, glows |
| Background | `#08080C` | `8, 8, 12` | Page background (near black) |
| Surface | `#12131C` | `18, 19, 28` | Cards, panels, elevated content |
| Text | `#E8E9F3` | `232, 233, 243` | Primary text content |
| Muted | `#5B5F77` | `91, 95, 119` | Secondary text, descriptions |

**Inspiration:** Festival lighting, neon signs, cyberpunk aesthetics

### Semantic Colors (Theme-Agnostic)

| Purpose | Light | Dark |
|---------|-------|------|
| Success | `#22c55e` | `#22c55e` |
| Error | `#ef4444` | `#ef4444` |
| Warning | `#f59e0b` | `#f59e0b` |
| Info | `#3b82f6` | `#3b82f6` |

### Contrast Ratios

All color combinations meet **WCAG 2.1 AA standards** (minimum 4.5:1 for text):

- Light theme text on background: 12.8:1 ✅
- Dark theme text on background: 13.2:1 ✅
- Primary on background (both): 4.6:1+ ✅

---

## Typography System

### Font Families

**Headline Font: Rozha One**
- **Provider:** Google Fonts
- **Style:** Serif
- **Weight:** 400 (regular only)
- **Usage:** Page titles, section headings, logo
- **CSS Variable:** `var(--font-headline)`

**Display/Body Font: Plus Jakarta Sans**
- **Provider:** Google Fonts
- **Style:** Sans-serif
- **Weights:** 300, 400, 500, 600, 700
- **Usage:** UI elements, body text, descriptions
- **CSS Variable:** `var(--font-body)`

**Monospace Font: Monaco**
- **Fallback:** 'Courier New', Courier, monospace
- **Usage:** Code snippets, terminal output
- **CSS Variable:** `var(--font-mono)`

### Google Fonts Integration

All HTML files must include this link in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Rozha+One&display=swap" rel="stylesheet">
```

### Type Scale

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `.text-xs` | 12px | 16px | Badges, tags, metadata |
| `.text-sm` | 14px | 20px | Captions, helper text |
| `.text-base` | 16px | 24px | Body copy (default) |
| `.text-lg` | 18px | 28px | Emphasized body text |
| `.text-xl` | 20px | 28px | Subheadings |
| `.text-2xl` | 24px | 32px | Section titles |
| `.text-3xl` | 30px | 36px | Card titles |
| `.text-4xl` | 36px | 40px | Page subtitles |
| `.text-5xl` | 48px | 1 | Hero text (mobile) |
| `.text-6xl` | 60px | 1 | Hero text (desktop) |

### Responsive Typography

```html
<!-- Mobile: 48px, Desktop: 60px -->
<h1 class="font-heading text-5xl md:text-6xl">
  DevToolbox
</h1>

<!-- Mobile: 18px, Tablet: 20px, Desktop: 24px -->
<p class="text-lg md:text-xl lg:text-2xl">
  Description text
</p>
```

---

## Material Symbols Integration

### Overview

DevToolbox uses **Material Symbols Outlined** for consistent, lightweight iconography.

**Provider:** Google Fonts  
**Style:** Outlined  
**Weight:** 400  
**Size:** 24px (default)

### Integration

Add to `<head>` of all HTML files:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0">
```

### Standard DevToolbox Icon Set

| Icon | Material Symbol | Usage |
|------|----------------|-------|
| Logo | `temple_hindu` | Site logo, branding |
| JSON Schema | `data_object` | JSON tool card |
| HTML/Markdown | `code_blocks` | Converter tool card |
| Text Diff | `difference` | Diff tool card |
| SIP Calculator | `trending_up` | SIP tool card |
| EMI Calculator | `account_balance` | EMI tool card |
| Theme Toggle (Dark) | `dark_mode` | Button icon |
| Theme Toggle (Light) | `light_mode` | Button icon |
| Menu | `menu` | Mobile navigation |
| Close | `close` | Modal close |
| Check | `check_circle` | Success state |
| Error | `error` | Error state |
| Info | `info` | Info tooltips |

### Usage

```html
<!-- Icon with utility classes -->
<span class="material-symbols-outlined text-primary dark:text-primary-dark text-2xl">
  temple_hindu
</span>

<!-- Icon button -->
<button class="flex items-center gap-2 p-2 hover:opacity-80" aria-label="Toggle theme">
  <span class="material-symbols-outlined">dark_mode</span>
</button>
```

### Custom Styling

```css
/* Adjust icon size */
.material-symbols-outlined {
  font-size: 24px; /* default */
}

/* Larger icon */
.material-symbols-outlined.text-4xl {
  font-size: 36px;
}

/* Custom weights (if needed) */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

---

## Spacing & Layout

### Spacing Scale (8px Grid)

DevToolbox uses an 8px base grid for consistent spacing:

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| 0 | `0` | 0px | Reset spacing |
| 1 | `0.25rem` | 4px | Tight spacing |
| 2 | `0.5rem` | 8px | Base unit |
| 3 | `0.75rem` | 12px | Small gaps |
| 4 | `1rem` | 16px | Standard spacing |
| 6 | `1.5rem` | 24px | Section gaps |
| 8 | `2rem` | 32px | Large spacing |
| 10 | `2.5rem` | 40px | XL spacing |
| 12 | `3rem` | 48px | XXL spacing |

### Breakpoints (Mobile-First)

```css
/* Base: Mobile (≥320px) */
/* No prefix needed - styles apply to all sizes */

/* Tablet (≥768px) */
@media (min-width: 768px) {
  .md\:flex-row { flex-direction: row; }
}

/* Desktop (≥1024px) */
@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}
```

### Container Patterns

```html
<!-- Full-width with max-width constraint -->
<div class="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40">
  <!-- Content -->
</div>

<!-- Responsive card grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <article>Card 1</article>
  <article>Card 2</article>
  <article>Card 3</article>
</div>
```

---

## Heritage Design Patterns

### Custom Theme Classes

Four special classes provide theme-specific visual treatments:

#### 1. `theme-image-radius`

**Purpose:** Dynamic border-radius based on theme

```css
.theme-image-radius {
  border-radius: 200px 200px 0 0; /* Light: arch shape */
}

.dark .theme-image-radius {
  border-radius: 4px; /* Dark: sharp edges */
}
```

**Usage:** Image containers, card tops

#### 2. `theme-shadow`

**Purpose:** Shadow style adapts to theme

```css
/* Light: Soft drop shadow */
.theme-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Dark: Cyan neon glow */
.dark .theme-shadow {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
}
```

#### 3. `theme-shadow-hover`

**Purpose:** Enhanced shadow on hover

```css
/* Light: Larger, darker shadow */
.theme-shadow-hover:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Dark: Stronger neon glow */
.dark .theme-shadow-hover:hover {
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.4);
}
```

#### 4. `theme-border`

**Purpose:** Border visibility based on theme

```css
/* Light: Transparent (shadow provides separation) */
.theme-border {
  border: 1px solid transparent;
}

/* Dark: Visible cyan border */
.dark .theme-border {
  border: 1px solid rgba(0, 240, 255, 0.3);
}
```

### Complete Card Pattern

```html
<article class="
  flex flex-col gap-4 p-6
  bg-surface-light dark:bg-surface-dark
  theme-image-radius theme-shadow theme-shadow-hover theme-border
  transition-all duration-300
  hover:scale-105 hover:-translate-y-2
">
  <!-- Content -->
</article>
```

---

## Browser Compatibility

### Supported Browsers

- **Chrome:** 90+ ✅
- **Firefox:** 88+ ✅
- **Safari:** 14+ ✅
- **Edge:** 90+ ✅

### Required Features

- CSS Grid & Flexbox
- CSS Custom Properties (variables)
- CSS Transitions & Transforms
- localStorage API
- matchMedia API (for system theme detection)

### Fallback Strategy

```css
/* System preference fallback if JS disabled */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* Apply dark theme defaults */
  }
}

@media (prefers-color-scheme: light) {
  :root:not(.dark) {
    /* Apply light theme defaults */
  }
}
```

---

## Related Documentation

- **[UTILITY_CLASS_SYSTEM.md](./UTILITY_CLASS_SYSTEM.md)** - Complete utility class reference
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - v1 → v2 migration patterns
- **[UX_DESIGN_SYSTEM.md](./UX_DESIGN_SYSTEM.md)** - Component specifications
- **[NEW_DESIGN_ANALYSIS.md](./NEW_DESIGN_ANALYSIS.md)** - Original design analysis

---

**Last Updated:** March 23, 2026  
**Version:** 2.0  
**Status:** Active
