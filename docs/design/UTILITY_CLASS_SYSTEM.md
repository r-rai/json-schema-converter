# DevToolbox Utility Class System Specification

**Version:** 2.0  
**Date:** March 23, 2026  
**Status:** Phase 1.1 - Design Complete  
**Related Docs:** 
- [NEW_DESIGN_ANALYSIS.md](./NEW_DESIGN_ANALYSIS.md)
- [NEW_DESIGN_IMPLEMENTATION_PLAN.md](../product/NEW_DESIGN_IMPLEMENTATION_PLAN.md)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Naming Conventions](#naming-conventions)
4. [Layout Utilities](#layout-utilities)
5. [Spacing Utilities](#spacing-utilities)
6. [Typography Utilities](#typography-utilities)
7. [Color Utilities](#color-utilities)
8. [Border & Radius Utilities](#border--radius-utilities)
9. [Effect Utilities](#effect-utilities)
10. [Responsive Design System](#responsive-design-system)
11. [Dark Mode Variants](#dark-mode-variants)
12. [Custom Theme Classes](#custom-theme-classes)
13. [Quick Reference](#quick-reference)
14. [Migration Guide](#migration-guide)

---

## Overview

The DevToolbox Utility Class System is a **Tailwind-inspired vanilla CSS implementation** that maintains the "zero frameworks" core principle while providing a modern, composable styling approach. This system enables developers to build UIs by composing small, single-purpose utility classes rather than writing custom CSS.

### Key Features

✅ **Vanilla CSS** - No build step, no frameworks, no dependencies  
✅ **Class-Based Theming** - Uses `.dark` prefix (industry standard)  
✅ **Responsive Design** - Mobile-first with `md:` and `lg:` breakpoints  
✅ **Heritage Compatible** - Uses CSS custom properties internally  
✅ **Performance Optimized** - Target <50KB uncompressed  
✅ **Browser-Only** - Consistent with DevToolbox principles  

### Architecture Approach

```
Utility Classes (HTML)
    ↓
CSS Custom Properties (Variables)
    ↓
Theme System (Light/Dark)
```

**Example:**
```html
<div class="flex items-center gap-4 p-4 bg-surface dark:bg-surface-dark">
  <!-- Content -->
</div>
```

Compiles to:
```css
.flex { display: flex; }
.items-center { align-items: center; }
.gap-4 { gap: 1rem; }
.p-4 { padding: 1rem; }
.bg-surface { background-color: var(--color-surface); }
.dark .dark\:bg-surface-dark { background-color: var(--color-surface-dark); }
```

---

## Design Philosophy

### 1. Composition Over Custom CSS

**❌ Old Approach (Custom CSS):**
```css
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: 0.5rem;
  transition: transform 0.3s;
}

.tool-card:hover {
  transform: translateY(-0.5rem);
}

[data-theme="dark"] .tool-card {
  background: var(--color-surface-dark);
}
```

**✅ New Approach (Utility Classes):**
```html
<article class="flex flex-col gap-4 p-6 bg-surface dark:bg-surface-dark rounded-lg transition-transform hover:-translate-y-2">
  <!-- Content -->
</article>
```

**Benefits:**
- **Less CSS bloat** - No unique class names for one-off components
- **Faster iteration** - Change styling directly in HTML
- **Better consistency** - Enforces design token usage
- **Easier responsiveness** - `md:flex-row` vs writing media queries

### 2. Mobile-First Responsive Design

**Base styles apply to all screen sizes, then progressively enhance:**

```html
<!-- Stack on mobile, side-by-side on tablet+ -->
<div class="flex flex-col md:flex-row gap-4">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- 1 column mobile, 2 tablet, 3 desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### 3. Theme-Aware by Default

**Every color utility has a dark mode counterpart:**

```html
<div class="bg-background-light dark:bg-background-dark 
            text-text-light dark:text-text-dark">
  <!-- Automatically adapts to theme toggle -->
</div>
```

### 4. Progressive Enhancement

**Utilities work without JavaScript, but enhance with theme toggle:**

```css
/* Light theme - default if no class */
.bg-surface { background-color: #F4EFE6; }

/* Dark theme - when html.dark exists */
.dark .dark\:bg-surface-dark { background-color: #12131C; }

/* Fallback to system preference if JS disabled */
@media (prefers-color-scheme: dark) {
  .bg-surface { background-color: #12131C; }
}
```

---

## Naming Conventions

### General Pattern

```
{property}{-modifier}?{-value}
```

**Examples:**
- `flex` → display: flex
- `flex-col` → flex-direction: column
- `gap-4` → gap: 1rem (16px)
- `text-2xl` → font-size: 1.5rem

### Responsive Prefixes

```
{breakpoint}\:{utility-class}
```

**Examples:**
- `md:flex-row` → flex-direction: row on tablet+
- `lg:grid-cols-3` → 3 columns on desktop+
- `md:text-xl` → larger font on tablet+

### Dark Mode Prefixes

```
dark\:{utility-class}
```

**Examples:**
- `dark:bg-surface-dark` → background in dark mode
- `dark:text-text-dark` → text color in dark mode
- `dark:border-accent-dark` → border color in dark mode

### Hover/Focus/Group Prefixes

```
hover\:{utility-class}
focus\:{utility-class}
group-hover\:{utility-class}
```

**Examples:**
- `hover:scale-110` → scale on hover
- `focus:outline-primary` → outline on focus
- `group-hover:opacity-100` → opacity when parent hovered

---

## Layout Utilities

### Display

```css
/* Display Types */
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.hidden { display: none; }

/* Visibility */
.visible { visibility: visible; }
.invisible { visibility: hidden; }
```

**Usage:**
```html
<div class="flex">Flexbox container</div>
<span class="hidden md:inline-block">Hide on mobile</span>
```

---

### Flexbox

#### Flex Direction
```css
.flex-row { flex-direction: row; }
.flex-row-reverse { flex-direction: row-reverse; }
.flex-col { flex-direction: column; }
.flex-col-reverse { flex-direction: column-reverse; }
```

#### Flex Wrap
```css
.flex-wrap { flex-wrap: wrap; }
.flex-wrap-reverse { flex-wrap: wrap-reverse; }
.flex-nowrap { flex-wrap: nowrap; }
```

#### Flex Grow/Shrink
```css
.flex-1 { flex: 1 1 0%; }
.flex-auto { flex: 1 1 auto; }
.flex-initial { flex: 0 1 auto; }
.flex-none { flex: none; }

.grow { flex-grow: 1; }
.grow-0 { flex-grow: 0; }
.shrink { flex-shrink: 1; }
.shrink-0 { flex-shrink: 0; }
```

#### Align Items (Cross-axis)
```css
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.items-center { align-items: center; }
.items-baseline { align-items: baseline; }
.items-stretch { align-items: stretch; }
```

#### Justify Content (Main-axis)
```css
.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }
```

#### Gap
```css
/* 8px Grid System */
.gap-0 { gap: 0; }
.gap-1 { gap: 0.25rem; }   /* 4px */
.gap-2 { gap: 0.5rem; }    /* 8px */
.gap-3 { gap: 0.75rem; }   /* 12px */
.gap-4 { gap: 1rem; }      /* 16px */
.gap-6 { gap: 1.5rem; }    /* 24px */
.gap-8 { gap: 2rem; }      /* 32px */
.gap-10 { gap: 2.5rem; }   /* 40px */
.gap-12 { gap: 3rem; }     /* 48px */

/* Directional Gap */
.gap-x-2 { column-gap: 0.5rem; }
.gap-x-4 { column-gap: 1rem; }
.gap-y-2 { row-gap: 0.5rem; }
.gap-y-4 { row-gap: 1rem; }
```

**Usage Examples:**
```html
<!-- Horizontal navigation bar -->
<nav class="flex items-center justify-between gap-8 px-4 py-3">
  <div class="flex items-center gap-4">
    <span class="material-symbols-outlined">temple_hindu</span>
    <h2 class="font-heading text-2xl">DevToolbox</h2>
  </div>
  <div class="hidden md:flex gap-9">
    <a href="#">Home</a>
    <a href="#">Tools</a>
    <a href="#">About</a>
  </div>
</nav>

<!-- Vertical card layout -->
<article class="flex flex-col gap-4">
  <div class="aspect-[16/9]">
    <img src="..." class="w-full h-full object-cover" />
  </div>
  <div class="flex flex-col gap-2">
    <h3 class="font-heading text-2xl">Card Title</h3>
    <p class="text-muted text-sm">Description...</p>
  </div>
</article>
```

---

### Grid

#### Grid Template Columns
```css
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

/* Responsive Variants */
@media (min-width: 768px) {
  .md\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

#### Grid Template Rows
```css
.grid-rows-1 { grid-template-rows: repeat(1, minmax(0, 1fr)); }
.grid-rows-2 { grid-template-rows: repeat(2, minmax(0, 1fr)); }
.grid-rows-3 { grid-template-rows: repeat(3, minmax(0, 1fr)); }
```

#### Grid Auto Flow
```css
.grid-flow-row { grid-auto-flow: row; }
.grid-flow-col { grid-auto-flow: column; }
.grid-flow-dense { grid-auto-flow: dense; }
```

**Usage Examples:**
```html
<!-- Responsive card grid: 1 col mobile, 2 tablet, 3 desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
  <article>Card 1</article>
  <article>Card 2</article>
  <article>Card 3</article>
  <article>Card 4</article>
  <article>Card 5</article>
  <article>Card 6</article>
</div>

<!-- Form layout: 2 column on desktop -->
<form class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <label>
    <span>First Name</span>
    <input type="text" class="w-full" />
  </label>
  <label>
    <span>Last Name</span>
    <input type="text" class="w-full" />
  </label>
  <label class="lg:col-span-2">
    <span>Email</span>
    <input type="email" class="w-full" />
  </label>
</form>
```

---

### Position & Placement

```css
/* Position */
.static { position: static; }
.fixed { position: fixed; }
.absolute { position: absolute; }
.relative { position: relative; }
.sticky { position: sticky; }

/* Inset (top/right/bottom/left) */
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.inset-auto { top: auto; right: auto; bottom: auto; left: auto; }

/* Individual sides */
.top-0 { top: 0; }
.right-0 { right: 0; }
.bottom-0 { bottom: 0; }
.left-0 { left: 0; }

.top-4 { top: 1rem; }
.right-4 { right: 1rem; }

/* Z-index */
.z-0 { z-index: 0; }
.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
.z-50 { z-index: 50; }
```

**Usage:**
```html
<!-- Overlay effect -->
<div class="relative">
  <img src="..." class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
  </div>
</div>
```

---

## Spacing Utilities

### Padding

```css
/* All sides */
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }   /* 4px */
.p-2 { padding: 0.5rem; }    /* 8px */
.p-3 { padding: 0.75rem; }   /* 12px */
.p-4 { padding: 1rem; }      /* 16px */
.p-5 { padding: 1.25rem; }   /* 20px */
.p-6 { padding: 1.5rem; }    /* 24px */
.p-8 { padding: 2rem; }      /* 32px */
.p-10 { padding: 2.5rem; }   /* 40px */
.p-12 { padding: 3rem; }     /* 48px */

/* Horizontal (left + right) */
.px-0 { padding-left: 0; padding-right: 0; }
.px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
.px-40 { padding-left: 10rem; padding-right: 10rem; }

/* Vertical (top + bottom) */
.py-0 { padding-top: 0; padding-bottom: 0; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }

/* Individual sides */
.pt-0 { padding-top: 0; }
.pt-2 { padding-top: 0.5rem; }
.pt-3 { padding-top: 0.75rem; }
.pt-4 { padding-top: 1rem; }

.pb-0 { padding-bottom: 0; }
.pb-1 { padding-bottom: 0.25rem; }
.pb-3 { padding-bottom: 0.75rem; }
.pb-6 { padding-bottom: 1.5rem; }

.pl-0 { padding-left: 0; }
.pl-1 { padding-left: 0.25rem; }

.pr-0 { padding-right: 0; }
.pr-1 { padding-right: 0.25rem; }

/* Responsive Variants */
@media (min-width: 768px) {
  .md\:px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
  .md\:py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
}

@media (min-width: 1024px) {
  .lg\:px-40 { padding-left: 10rem; padding-right: 10rem; }
}
```

### Margin

```css
/* All sides */
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-4 { margin: 1rem; }
.m-auto { margin: auto; }

/* Horizontal (left + right) */
.mx-auto { margin-left: auto; margin-right: auto; }
.mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
.mx-4 { margin-left: 1rem; margin-right: 1rem; }

/* Vertical (top + bottom) */
.my-0 { margin-top: 0; margin-bottom: 0; }
.my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
.my-4 { margin-top: 1rem; margin-bottom: 1rem; }

/* Individual sides */
.mt-0 { margin-top: 0; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }

.mb-0 { margin-bottom: 0; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }

.ml-0 { margin-left: 0; }
.ml-2 { margin-left: 0.5rem; }
.ml-auto { margin-left: auto; }

.mr-0 { margin-right: 0; }
.mr-2 { margin-right: 0.5rem; }
.mr-auto { margin-right: auto; }

/* Negative margins */
.-mt-2 { margin-top: -0.5rem; }
.-mb-2 { margin-bottom: -0.5rem; }
```

### Space Between (Gap Alternative for Flexbox)

```css
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-x-6 > * + * { margin-left: 1.5rem; }

.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
```

**Usage:**
```html
<!-- Page container with responsive padding -->
<div class="px-4 sm:px-10 lg:px-40 py-5">
  <div class="max-w-[1200px] mx-auto">
    <!-- Content centered, max 1200px wide -->
  </div>
</div>

<!-- Card with consistent padding -->
<article class="p-6 mb-8">
  <h2 class="mb-4">Title</h2>
  <p class="mb-2">Content</p>
</article>
```

---

## Typography Utilities

### Font Size

```css
/* Font sizes with line-height */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* 12px/16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px/20px */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px/24px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px/28px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* 20px/28px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px/32px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* 30px/36px */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* 36px/40px */
.text-5xl { font-size: 3rem; line-height: 1; }            /* 48px */
.text-6xl { font-size: 3.75rem; line-height: 1; }         /* 60px */

/* Responsive variants */
@media (min-width: 768px) {
  .md\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .md\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .md\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .md\:text-5xl { font-size: 3rem; line-height: 1; }
  .md\:text-6xl { font-size: 3.75rem; line-height: 1; }
}

@media (min-width: 1024px) {
  .lg\:text-6xl { font-size: 3.75rem; line-height: 1; }
}
```

### Font Weight

```css
.font-thin { font-weight: 100; }
.font-extralight { font-weight: 200; }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
.font-black { font-weight: 900; }
```

### Font Family

```css
/* Heritage Typography System */
.font-heading { 
  font-family: 'Rozha One', serif; 
  font-weight: 400;
}

.font-display { 
  font-family: 'Plus Jakarta Sans', sans-serif; 
}

.font-mono { 
  font-family: 'Monaco', 'Courier New', 'Courier', monospace; 
}
```

### Font Style

```css
.italic { font-style: italic; }
.not-italic { font-style: normal; }
```

### Text Transform

```css
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }
.normal-case { text-transform: none; }
```

### Text Alignment

```css
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }
```

### Letter Spacing

```css
.tracking-tighter { letter-spacing: -0.05em; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-normal { letter-spacing: 0; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }

/* Custom tracking for badges/labels */
.tracking-\[1\.5px\] { letter-spacing: 1.5px; }
```

### Line Height

```css
.leading-none { line-height: 1; }
.leading-tight { line-height: 1.25; }
.leading-snug { line-height: 1.375; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.625; }
.leading-loose { line-height: 2; }
```

### Text Decoration

```css
.underline { text-decoration: underline; }
.line-through { text-decoration: line-through; }
.no-underline { text-decoration: none; }

.decoration-solid { text-decoration-style: solid; }
.decoration-dashed { text-decoration-style: dashed; }
```

### Text Overflow

```css
.truncate { 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap; 
}

.text-ellipsis { text-overflow: ellipsis; }
.text-clip { text-overflow: clip; }

/* Line clamp (multi-line truncation) */
.line-clamp-1 { 
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 { 
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 { 
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Whitespace

```css
.whitespace-normal { white-space: normal; }
.whitespace-nowrap { white-space: nowrap; }
.whitespace-pre { white-space: pre; }
.whitespace-pre-line { white-space: pre-line; }
.whitespace-pre-wrap { white-space: pre-wrap; }
```

**Usage:**
```html
<!-- Page title with responsive sizing -->
<h1 class="font-heading text-5xl md:text-6xl text-text-light dark:text-text-dark font-normal leading-tight">
  Creations
</h1>

<!-- Muted description text -->
<p class="text-muted-light dark:text-muted-dark text-lg max-w-2xl font-display font-normal leading-relaxed">
  Exploring the intersection of ancient wisdom and modern code.
</p>

<!-- Uppercase label/badge -->
<span class="text-xs font-semibold uppercase tracking-[1.5px]">React</span>

<!-- Truncated description -->
<p class="text-muted text-sm leading-relaxed line-clamp-2">
  Long description that will be truncated after two lines...
</p>
```

---

## Color Utilities

### Color Palette

**Light Theme:**
- Primary: `#C84B31` (terracotta)
- Accent: `#E3A857` (honey gold)
- Background: `#FDFBF7` (warm off-white)
- Surface: `#F4EFE6` (light beige)
- Text: `#2D2A26` (dark brown)
- Muted: `#9C9283` (warm gray)

**Dark Theme:**
- Primary: `#FF6B35` (neon saffron/orange)
- Accent: `#00F0FF` (cyan)
- Background: `#08080C` (near black)
- Surface: `#12131C` (dark gray)
- Text: `#E8E9F3` (off-white)
- Muted: `#5B5F77` (cool gray)

### Background Colors

```css
/* Light theme backgrounds */
.bg-background-light { background-color: #FDFBF7; }
.bg-surface-light { background-color: #F4EFE6; }
.bg-primary { background-color: #C84B31; }
.bg-accent-light { background-color: #E3A857; }

/* Dark theme backgrounds */
.dark .dark\:bg-background-dark { background-color: #08080C; }
.dark .dark\:bg-surface-dark { background-color: #12131C; }
.dark .dark\:bg-primary-dark { background-color: #FF6B35; }
.dark .dark\:bg-accent-dark { background-color: #00F0FF; }

/* Semantic colors */
.bg-success { background-color: #22c55e; }
.bg-error { background-color: #ef4444; }
.bg-warning { background-color: #f59e0b; }
.bg-info { background-color: #3b82f6; }

/* Transparent/opacity variants */
.bg-transparent { background-color: transparent; }
.bg-opacity-0 { background-color: rgba(0, 0, 0, 0); }
.bg-opacity-50 { background-color: rgba(0, 0, 0, 0.5); }

/* Gradient overlays */
.bg-gradient-to-t { background-image: linear-gradient(to top, var(--tw-gradient-stops)); }
.bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }
.bg-gradient-to-l { background-image: linear-gradient(to left, var(--tw-gradient-stops)); }
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
.bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }

/* Gradient stops (use with bg-gradient-*) */
.from-background-light\/80 { --tw-gradient-from: rgba(253, 251, 247, 0.8); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.from-primary\/80 { --tw-gradient-from: rgba(200, 75, 49, 0.8); }
.to-transparent { --tw-gradient-to: transparent; }

.dark .dark\:from-background-dark\/80 { --tw-gradient-from: rgba(8, 8, 12, 0.8); }
.dark .dark\:from-primary-dark\/80 { --tw-gradient-from: rgba(255, 107, 53, 0.8); }
```

### Text Colors

```css
/* Light theme text */
.text-text-light { color: #2D2A26; }
.text-muted-light { color: #9C9283; }
.text-primary { color: #C84B31; }
.text-accent-light { color: #E3A857; }

/* Dark theme text */
.dark .dark\:text-text-dark { color: #E8E9F3; }
.dark .dark\:text-muted-dark { color: #5B5F77; }
.dark .dark\:text-primary-dark { color: #FF6B35; }
.dark .dark\:text-accent-dark { color: #00F0FF; }

/* Semantic colors */
.text-success { color: #22c55e; }
.text-error { color: #ef4444; }
.text-warning { color: #f59e0b; }
.text-info { color: #3b82f6; }

/* Hover variants */
.hover\:text-primary:hover { color: #C84B31; }
.dark .dark\:hover\:text-primary-dark:hover { color: #FF6B35; }
```

### Border Colors

```css
/* Light theme borders */
.border-muted-light\/20 { border-color: rgba(156, 146, 131, 0.2); }
.border-primary { border-color: #C84B31; }
.border-transparent { border-color: transparent; }
.border-accent-light\/30 { border-color: rgba(227, 168, 87, 0.3); }

/* Dark theme borders */
.dark .dark\:border-muted-dark\/30 { border-color: rgba(91, 95, 119, 0.3); }
.dark .dark\:border-primary-dark { border-color: #FF6B35; }
.dark .dark\:border-accent-dark { border-color: #00F0FF; }
.dark .dark\:border-accent-dark\/30 { border-color: rgba(0, 240, 255, 0.3); }

/* Hover variants */
.hover\:border-primary:hover { border-color: #C84B31; }
.dark .dark\:hover\:border-accent-dark:hover { border-color: #00F0FF; }
```

**Usage:**
```html
<!-- Theme-aware container -->
<div class="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
  <!-- Content adapts to theme automatically -->
</div>

<!-- Card with theme-aware styling -->
<article class="bg-surface-light dark:bg-surface-dark p-6 rounded-lg">
  <h3 class="text-primary dark:text-primary-dark font-heading text-2xl">
    Card Title
  </h3>
  <p class="text-muted-light dark:text-text-dark text-sm">
    Description text that's readable in both themes
  </p>
</article>

<!-- Gradient overlay on image -->
<div class="relative">
  <img src="..." />
  <div class="absolute inset-0 bg-gradient-to-t from-background-light/80 to-transparent dark:from-background-dark/80"></div>
</div>
```

---

## Border & Radius Utilities

### Border Width

```css
.border { border-width: 1px; border-style: solid; }
.border-0 { border-width: 0; }
.border-2 { border-width: 2px; }
.border-4 { border-width: 4px; }

/* Individual sides */
.border-t { border-top-width: 1px; border-top-style: solid; }
.border-t-0 { border-top-width: 0; }
.border-t-2 { border-top-width: 2px; }

.border-r { border-right-width: 1px; border-right-style: solid; }
.border-r-0 { border-right-width: 0; }

.border-b { border-bottom-width: 1px; border-bottom-style: solid; }
.border-b-0 { border-bottom-width: 0; }
.border-b-2 { border-bottom-width: 2px; }
.border-b-\[2px\] { border-bottom-width: 2px; }

.border-l { border-left-width: 1px; border-left-style: solid; }
.border-l-0 { border-left-width: 0; }
```

### Border Style

```css
.border-solid { border-style: solid; }
.border-dashed { border-style: dashed; }
.border-dotted { border-style: dotted; }
.border-none { border-style: none; }
```

### Border Radius

```css
/* Standard radii */
.rounded-none { border-radius: 0; }
.rounded-sm { border-radius: 0.125rem; }  /* 2px */
.rounded { border-radius: 0.25rem; }      /* 4px */
.rounded-md { border-radius: 0.375rem; }  /* 6px */
.rounded-lg { border-radius: 0.5rem; }    /* 8px */
.rounded-xl { border-radius: 1rem; }      /* 16px */
.rounded-2xl { border-radius: 2rem; }     /* 32px */
.rounded-3xl { border-radius: 3rem; }     /* 48px */
.rounded-full { border-radius: 9999px; }

/* Custom Heritage radii */
.rounded-arch { border-radius: 200px 200px 0 0; }
.rounded-sharp { border-radius: 4px; }

/* Individual corners */
.rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
.rounded-b-lg { border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
.rounded-tl-lg { border-top-left-radius: 0.5rem; }
.rounded-tr-lg { border-top-right-radius: 0.5rem; }
.rounded-bl-lg { border-bottom-left-radius: 0.5rem; }
.rounded-br-lg { border-bottom-right-radius: 0.5rem; }

/* Dark mode conditional radius - handled by theme classes */
.dark .dark\:rounded-sharp { border-radius: 4px; }
```

### Outline

```css
.outline-none { outline: 2px solid transparent; outline-offset: 2px; }
.outline { outline-style: solid; }
.outline-dashed { outline-style: dashed; }

.outline-0 { outline-width: 0px; }
.outline-1 { outline-width: 1px; }
.outline-2 { outline-width: 2px; }

.outline-primary { outline-color: #C84B31; }
.outline-accent { outline-color: #E3A857; }

.outline-offset-0 { outline-offset: 0px; }
.outline-offset-2 { outline-offset: 2px; }
.outline-offset-4 { outline-offset: 4px; }
```

**Usage:**
```html
<!-- Header with bottom border -->
<header class="flex items-center justify-between border-b border-solid border-muted-light/20 dark:border-muted-dark/30 px-4 py-3 mb-8">
  <!-- Content -->
</header>

<!-- Active tab indicator -->
<button class="border-b-[2px] border-primary dark:border-primary-dark pb-3 pt-2">
  <span class="text-sm font-semibold uppercase tracking-[1.5px]">All</span>
</button>

<!-- Badge with theme-specific radius -->
<span class="px-3 py-1 bg-surface-light dark:bg-surface-dark text-primary text-[10px] uppercase rounded-full dark:rounded-sharp border border-transparent dark:border-accent-dark/30">
  React
</span>

<!-- Focus outline for accessibility -->
<button class="focus:outline-2 focus:outline-primary focus:outline-offset-2">
  Accessible Button
</button>
```

---

## Effect Utilities

### Box Shadow

```css
/* Standard shadows */
.shadow-none { box-shadow: none; }
.shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.shadow { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
.shadow-xl { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1); }

/* Heritage card shadows (theme-aware) */
.shadow-card-light { box-shadow: 0 8px 30px rgba(200, 75, 49, 0.08); }
.shadow-card-hover-light { box-shadow: 0 12px 40px rgba(200, 75, 49, 0.15); }

.dark .dark\:shadow-card-dark { box-shadow: 0 0 15px rgba(255, 107, 53, 0.4); }
.dark .dark\:shadow-card-hover-dark { box-shadow: 0 0 25px rgba(255, 107, 53, 0.6); }

/* Neon/glow shadows (dark mode specific) */
.shadow-neon-cyan { box-shadow: 0 0 10px rgba(0, 240, 255, 0.4); }
.dark .dark\:shadow-neon-cyan { box-shadow: 0 0 10px rgba(0, 240, 255, 0.4); }
```

### Opacity

```css
.opacity-0 { opacity: 0; }
.opacity-10 { opacity: 0.1; }
.opacity-20 { opacity: 0.2; }
.opacity-30 { opacity: 0.3; }
.opacity-40 { opacity: 0.4; }
.opacity-50 { opacity: 0.5; }
.opacity-60 { opacity: 0.6; }
.opacity-70 { opacity: 0.7; }
.opacity-80 { opacity: 0.8; }
.opacity-90 { opacity: 0.9; }
.opacity-100 { opacity: 1; }

/* Hover variants */
.hover\:opacity-100:hover { opacity: 1; }
.hover\:opacity-80:hover { opacity: 0.8; }

/* Group hover variants */
.group:hover .group-hover\:opacity-100 { opacity: 1; }
.group:hover .group-hover\:opacity-0 { opacity: 0; }
```

### Transitions

```css
/* Transition properties */
.transition-none { transition-property: none; }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; }
.transition-colors { transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

/* Transition durations */
.duration-75 { transition-duration: 75ms; }
.duration-100 { transition-duration: 100ms; }
.duration-150 { transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }
.duration-500 { transition-duration: 500ms; }

/* Transition timing functions */
.ease-linear { transition-timing-function: linear; }
.ease-in { transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }
.ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
```

### Transforms

```css
/* Scale */
.scale-0 { transform: scale(0); }
.scale-50 { transform: scale(0.5); }
.scale-75 { transform: scale(0.75); }
.scale-90 { transform: scale(0.9); }
.scale-95 { transform: scale(0.95); }
.scale-100 { transform: scale(1); }
.scale-105 { transform: scale(1.05); }
.scale-110 { transform: scale(1.1); }
.scale-125 { transform: scale(1.25); }

.hover\:scale-110:hover { transform: scale(1.1); }
.hover\:scale-105:hover { transform: scale(1.05); }

/* Rotate */
.rotate-0 { transform: rotate(0deg); }
.rotate-45 { transform: rotate(45deg); }
.rotate-90 { transform: rotate(90deg); }
.rotate-180 { transform: rotate(180deg); }

/* Translate */
.translate-x-0 { transform: translateX(0); }
.translate-y-0 { transform: translateY(0); }

.-translate-y-2 { transform: translateY(-0.5rem); }   /* 8px up */
.-translate-y-4 { transform: translateY(-1rem); }     /* 16px up */

.translate-y-1 { transform: translateY(0.25rem); }    /* 4px down */
.translate-y-2 { transform: translateY(0.5rem); }     /* 8px down */

.hover\:-translate-y-2:hover { transform: translateY(-0.5rem); }
.hover\:translate-y-1:hover { transform: translateY(0.25rem); }

/* Transform origin */
.origin-center { transform-origin: center; }
.origin-top { transform-origin: top; }
.origin-bottom { transform-origin: bottom; }
```

### Filters

```css
/* Blur */
.blur-none { filter: blur(0); }
.blur-sm { filter: blur(4px); }
.blur { filter: blur(8px); }
.blur-lg { filter: blur(16px); }

/* Grayscale */
.grayscale-0 { filter: grayscale(0); }
.grayscale { filter: grayscale(100%); }

.dark .dark\:grayscale-0 { filter: grayscale(0); }

/* Invert */
.invert-0 { filter: invert(0); }
.invert { filter: invert(100%); }

.dark .dark\:invert { filter: invert(100%); }

/* Hue rotate (color shift) */
.hue-rotate-0 { filter: hue-rotate(0deg); }
.hue-rotate-180 { filter: hue-rotate(180deg); }

.dark .dark\:hue-rotate-180 { filter: hue-rotate(180deg); }
```

### Cursor

```css
.cursor-auto { cursor: auto; }
.cursor-default { cursor: default; }
.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-wait { cursor: wait; }
.cursor-text { cursor: text; }
.cursor-move { cursor: move; }
```

### Overflow

```css
.overflow-auto { overflow: auto; }
.overflow-hidden { overflow: hidden; }
.overflow-visible { overflow: visible; }
.overflow-scroll { overflow: scroll; }

.overflow-x-auto { overflow-x: auto; }
.overflow-x-hidden { overflow-x: hidden; }
.overflow-y-auto { overflow-y: auto; }
.overflow-y-hidden { overflow-y: hidden; }
```

**Usage:**
```html
<!-- Card with hover lift effect -->
<article class="group cursor-pointer transition-transform duration-300 hover:-translate-y-2">
  <div class="theme-shadow theme-shadow-hover transition-all duration-300">
    <img class="opacity-90 group-hover:opacity-100 transition-opacity" src="..." />
    
    <!-- Gradient overlay on hover -->
    <div class="absolute inset-0 bg-gradient-to-t from-background-light/80 to-transparent dark:from-background-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    </div>
  </div>
</article>

<!-- Theme toggle button with hover scale -->
<button class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark hover:scale-110 transition-transform">
  <span class="material-symbols-outlined">dark_mode</span>
</button>

<!-- Image with theme-specific filter -->
<img class="opacity-90 group-hover:opacity-100 transition-opacity grayscale dark:grayscale-0 dark:hue-rotate-180" src="..." />
```

---

## Responsive Design System

### Breakpoints

DevToolbox uses a **mobile-first responsive design** strategy with three breakpoints:

| Breakpoint | Min Width | Prefix | Device Target |
|------------|-----------|--------|---------------|
| Mobile     | 320px     | *(none)* | Smartphones |
| Tablet     | 768px     | `md:` | Tablets, small laptops |
| Desktop    | 1024px    | `lg:` | Desktops, large screens |

### Syntax

```
{breakpoint}\:{utility-class}
```

**Examples:**
- `md:flex-row` → Apply on tablet+
- `lg:grid-cols-3` → Apply on desktop+
- `md:text-xl` → Apply on tablet+

### Implementation (CSS)

```css
/* Base styles (mobile-first - no prefix) */
.flex-col { flex-direction: column; }

/* Tablet and above (md:) */
@media (min-width: 768px) {
  .md\:flex-row { flex-direction: row; }
  .md\:text-xl { font-size: 1.25rem; }
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Desktop and above (lg:) */
@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:px-40 { padding-left: 10rem; padding-right: 10rem; }
}
```

### Common Responsive Patterns

#### 1. Stack on Mobile, Side-by-Side on Tablet+

```html
<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1">Left content</div>
  <div class="flex-1">Right content</div>
</div>
```

**Result:**
- **Mobile (<768px):** Items stacked vertically
- **Tablet+ (≥768px):** Items side-by-side horizontally

#### 2. Responsive Grid (1 → 2 → 3 columns)

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <article>Card 1</article>
  <article>Card 2</article>
  <article>Card 3</article>
  <article>Card 4</article>
  <article>Card 5</article>
  <article>Card 6</article>
</div>
```

**Result:**
- **Mobile (<768px):** 1 column (stacked)
- **Tablet (768-1023px):** 2 columns
- **Desktop (≥1024px):** 3 columns

#### 3. Hide on Mobile, Show on Desktop

```html
<nav class="hidden md:flex items-center gap-9">
  <a href="#">Home</a>
  <a href="#">Tools</a>
  <a href="#">About</a>
</nav>
```

**Result:**
- **Mobile (<768px):** Navigation hidden (show hamburger menu instead)
- **Tablet+ (≥768px):** Full navigation visible

#### 4. Responsive Text Sizing

```html
<h1 class="font-heading text-4xl md:text-5xl lg:text-6xl">
  DevToolbox
</h1>

<p class="text-sm md:text-base lg:text-lg">
  Description text that scales up on larger screens.
</p>
```

**Result:**
- **Mobile:** 36px heading, 14px text
- **Tablet:** 48px heading, 16px text
- **Desktop:** 60px heading, 18px text

#### 5. Responsive Padding

```html
<div class="px-4 md:px-10 lg:px-40 py-5">
  <!-- More padding on larger screens -->
</div>
```

**Result:**
- **Mobile:** 16px horizontal padding
- **Tablet:** 40px horizontal padding
- **Desktop:** 160px horizontal padding

#### 6. Responsive Container

```html
<div class="max-w-full md:max-w-[1200px] mx-auto px-4">
  <!-- Content centered on large screens, full-width on mobile -->
</div>
```

### Complete Page Layout Example

```html
<!-- Responsive page container -->
<div class="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
  <div class="flex flex-col max-w-[1200px] flex-1 w-full">
    
    <!-- Header: Stack on mobile, horizontal on tablet+ -->
    <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 px-4 py-3 mb-8">
      <!-- Logo + Title -->
      <div class="flex items-center gap-4">
        <span class="material-symbols-outlined">temple_hindu</span>
        <h2 class="font-heading text-2xl">DevToolbox</h2>
      </div>
      
      <!-- Navigation: Hidden on mobile, flex on tablet+ -->
      <div class="flex items-center gap-8 w-full md:w-auto">
        <nav class="hidden md:flex gap-9">
          <a href="#">Home</a>
          <a href="#">Experience</a>
          <a href="#">Creations</a>
        </nav>
        <button class="ml-auto md:ml-0">Theme Toggle</button>
      </div>
    </header>
    
    <!-- Page title: Smaller on mobile, larger on desktop -->
    <div class="flex flex-col gap-4 p-4 mb-6">
      <h1 class="font-heading text-5xl md:text-6xl">Creations</h1>
      <p class="text-base md:text-lg max-w-2xl">
        Exploring the intersection of ancient wisdom and modern code.
      </p>
    </div>
    
    <!-- Card grid: 1 col mobile, 2 tablet, 3 desktop -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      <article>Card 1</article>
      <article>Card 2</article>
      <article>Card 3</article>
      <article>Card 4</article>
      <article>Card 5</article>
      <article>Card 6</article>
    </div>
    
  </div>
</div>
```

---

## Dark Mode Variants

### Theme Toggle Mechanism

DevToolbox uses **class-based theming** with the `.dark` class on the `<html>` element:

```html
<!-- Light mode -->
<html class="light" lang="en">

<!-- Dark mode -->
<html class="dark" lang="en">
```

JavaScript toggles the class:

```javascript
// Toggle theme
function toggleTheme() {
  const html = document.documentElement;
  
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    html.classList.add('light');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Load saved theme or use system preference
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.classList.add(theme);
}

// Initialize on load
loadTheme();
```

### Dark Mode Variant Syntax

```css
.dark .dark\:{utility-class} { /* styles */ }
```

**Example:**
```css
/* Light mode (default) */
.bg-surface { background-color: #F4EFE6; }

/* Dark mode (when html.dark exists) */
.dark .dark\:bg-surface-dark { background-color: #12131C; }
```

**HTML:**
```html
<div class="bg-surface dark:bg-surface-dark">
  <!-- Automatically switches based on theme -->
</div>
```

### Common Dark Mode Patterns

#### 1. Background & Text Colors

```html
<body class="bg-background-light dark:bg-background-dark 
             text-text-light dark:text-text-dark 
             font-display min-h-screen transition-colors duration-300">
  <!-- Entire page adapts to theme -->
</body>
```

#### 2. Card/Surface Components

```html
<article class="bg-surface-light dark:bg-surface-dark 
                text-text-light dark:text-text-dark 
                p-6 rounded-lg">
  <h3 class="text-primary dark:text-primary-dark font-heading text-2xl">
    Card Title
  </h3>
  <p class="text-muted-light dark:text-muted-dark text-sm">
    Description text
  </p>
</article>
```

#### 3. Borders

```html
<header class="border-b border-solid border-muted-light/20 dark:border-muted-dark/30">
  <!-- Border color changes with theme -->
</header>

<button class="border-b-2 border-primary dark:border-primary-dark">
  Active Tab
</button>
```

#### 4. Hover States

```html
<a href="#" class="text-text-light dark:text-text-dark 
                   hover:text-primary dark:hover:text-primary-dark 
                   transition-colors">
  Link Text
</a>
```

#### 5. Icons

```html
<button>
  <!-- Show dark_mode icon in dark mode -->
  <span class="material-symbols-outlined dark:block hidden">dark_mode</span>
  
  <!-- Show light_mode icon in light mode -->
  <span class="material-symbols-outlined light:block dark:hidden">light_mode</span>
</button>
```

### System Preference Fallback

For users without JavaScript or before theme loads:

```css
/* Default: Light theme */
.bg-surface { background-color: #F4EFE6; }

/* Dark mode via class (JS) */
.dark .dark\:bg-surface-dark { background-color: #12131C; }

/* Dark mode via system preference (no JS) */
@media (prefers-color-scheme: dark) {
  .bg-surface { background-color: #12131C; }
}
```

### Complete Dark Mode Example

```html
<!-- Page wrapper -->
<div class="bg-background-light dark:bg-background-dark 
            text-text-light dark:text-text-dark 
            min-h-screen transition-colors duration-300">
  
  <!-- Header -->
  <header class="border-b border-muted-light/20 dark:border-muted-dark/30 px-4 py-3">
    <div class="flex items-center justify-between">
      
      <!-- Logo (changes color) -->
      <div class="flex items-center gap-4">
        <span class="material-symbols-outlined text-primary dark:text-accent-dark">
          temple_hindu
        </span>
        <h2 class="font-heading text-2xl text-text-light dark:text-text-dark">
          DevToolbox
        </h2>
      </div>
      
      <!-- Navigation links -->
      <nav class="hidden md:flex gap-9">
        <a href="#" class="text-text-light dark:text-text-dark 
                           hover:text-primary dark:hover:text-primary-dark 
                           transition-colors">
          Home
        </a>
        <a href="#" class="text-primary dark:text-primary-dark 
                           border-b-2 border-primary dark:border-primary-dark">
          Creations
        </a>
      </nav>
      
      <!-- Theme toggle button -->
      <button aria-label="Toggle Theme" 
              class="flex h-10 w-10 items-center justify-center rounded-full 
                     bg-surface-light dark:bg-surface-dark 
                     text-text-light dark:text-accent-dark 
                     hover:scale-110 transition-transform"
              onclick="toggleTheme()">
        <span class="material-symbols-outlined dark:block hidden">dark_mode</span>
        <span class="material-symbols-outlined light:block dark:hidden">light_mode</span>
      </button>
    </div>
  </header>
  
  <!-- Card Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
    <article class="bg-surface-light dark:bg-surface-dark 
                    rounded-lg overflow-hidden 
                    transition-transform hover:-translate-y-2">
      <div class="theme-shadow theme-shadow-hover">
        <img src="..." class="w-full h-full object-cover 
                              opacity-90 group-hover:opacity-100" />
      </div>
      
      <div class="p-4">
        <h3 class="font-heading text-2xl text-text-light dark:text-text-dark mb-2">
          Card Title
        </h3>
        <p class="text-muted-light dark:text-text-dark text-sm line-clamp-2">
          Description text that adapts to theme
        </p>
        
        <!-- Badges with theme-specific styling -->
        <div class="flex gap-2 mt-4">
          <span class="px-3 py-1 bg-surface-light dark:bg-surface-dark 
                       text-primary text-[10px] uppercase rounded-full dark:rounded-sharp 
                       border border-transparent dark:border-accent-dark/30 
                       dark:text-text-dark dark:bg-primary-dark/20">
            React
          </span>
        </div>
      </div>
    </article>
  </div>
  
</div>
```

---

## Custom Theme Classes

Some visual effects require **mode-specific styling** that can't be achieved with simple color/border utilities alone. DevToolbox includes custom `.theme-*` classes for these cases.

### .theme-image-radius

**Purpose:** Apply different border-radius based on theme
- **Light mode:** Arch radius (200px 200px 0 0) - warm, organic
- **Dark mode:** Sharp radius (4px) - geometric, cyber

**CSS Implementation:**
```css
.theme-image-radius {
  border-radius: 200px 200px 0 0;  /* Default: arch (light) */
}

.dark .theme-image-radius {
  border-radius: 4px;  /* Override: sharp (dark) */
}
```

**Usage:**
```html
<div class="aspect-[16/9] overflow-hidden theme-image-radius">
  <img src="..." class="w-full h-full object-cover" />
</div>
```

**Result:**
- **Light mode:** Top corners heavily rounded (arch shape)
- **Dark mode:** All corners slightly rounded (sharp edges)

---

### .theme-shadow

**Purpose:** Apply theme-appropriate shadows
- **Light mode:** Soft drop shadow (warm, subtle)
- **Dark mode:** Neon glow (orange/saffron glow effect)

**CSS Implementation:**
```css
.theme-shadow {
  box-shadow: 0 8px 30px rgba(200, 75, 49, 0.08);  /* Default: drop shadow (light) */
}

.dark .theme-shadow {
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.4);  /* Override: neon glow (dark) */
}
```

**Usage:**
```html
<article class="theme-shadow bg-surface-light dark:bg-surface-dark p-6 rounded-lg">
  <!-- Card with appropriate shadow for theme -->
</article>
```

**Result:**
- **Light mode:** Traditional drop shadow below element
- **Dark mode:** Glowing halo around element (neon effect)

---

### .theme-shadow-hover

**Purpose:** Enhanced shadow effect on hover
- **Light mode:** Stronger drop shadow + subtle lift
- **Dark mode:** Intensified neon glow + border color change

**CSS Implementation:**
```css
.theme-shadow-hover:hover {
  box-shadow: 0 12px 40px rgba(200, 75, 49, 0.15);  /* Stronger drop shadow */
}

.dark .theme-shadow-hover:hover {
  box-shadow: 0 0 25px rgba(255, 107, 53, 0.6);  /* Intensified glow */
  border-color: #00F0FF;  /* Cyan accent border */
}
```

**Usage:**
```html
<article class="theme-shadow theme-shadow-hover transition-all duration-300 hover:-translate-y-2">
  <!-- Card lifts and shadow intensifies on hover -->
</article>
```

**Result:**
- **Light mode:** Shadow deepens, card appears to float higher
- **Dark mode:** Glow intensifies, cyan border appears

---

### .theme-border

**Purpose:** Theme-specific border styling
- **Light mode:** No border (transparent)
- **Dark mode:** Subtle cyan border for neon aesthetic

**CSS Implementation:**
```css
.theme-border {
  border: 1px solid transparent;  /* Default: no border (light) */
}

.dark .theme-border {
  border: 1px solid rgba(0, 240, 255, 0.2);  /* Cyan border with transparency */
}
```

**Usage:**
```html
<div class="theme-border theme-shadow rounded-lg p-6">
  <!-- Border only visible in dark mode -->
</div>
```

**Result:**
- **Light mode:** Clean edges, no visible border
- **Dark mode:** Subtle cyan outline that complements neon glow

---

### Complete Card Example with Theme Classes

```html
<article class="flex flex-col gap-4 pb-4 group cursor-pointer transition-transform duration-300 hover:-translate-y-2">
  
  <!-- Image container with theme-specific styling -->
  <div class="w-full aspect-[16/9] 
              bg-surface-light dark:bg-surface-dark 
              bg-cover bg-center 
              theme-image-radius           <!-- Arch light, sharp dark -->
              overflow-hidden relative 
              theme-shadow                 <!-- Drop shadow light, glow dark -->
              theme-shadow-hover           <!-- Enhanced hover effects -->
              theme-border                 <!-- No border light, cyan dark -->
              transition-all duration-300">
    
    <!-- Image -->
    <img alt="Project thumbnail" 
         class="w-full h-full object-cover 
                opacity-90 group-hover:opacity-100 
                transition-opacity" 
         src="project-image.jpg" />
    
    <!-- Gradient overlay on hover -->
    <div class="absolute inset-0 
                bg-gradient-to-t 
                from-background-light/80 to-transparent 
                dark:from-background-dark/80 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-300">
    </div>
  </div>
  
  <!-- Card content -->
  <div class="flex flex-col gap-2 px-1">
    <div class="flex justify-between items-start">
      <h3 class="font-heading text-2xl text-text-light dark:text-text-dark">
        Vedic AI Assistant
      </h3>
      <span class="text-muted-light dark:text-text-dark text-xs font-medium tracking-wider">
        JAN 2024
      </span>
    </div>
    
    <p class="text-muted-light dark:text-text-dark text-sm leading-relaxed line-clamp-2">
      An AI trained on ancient texts to provide contextual wisdom.
    </p>
    
    <!-- Tech tags with theme-specific styling -->
    <div class="flex flex-wrap gap-2 mt-2">
      <span class="px-3 py-1 
                   bg-surface-light dark:bg-surface-dark 
                   text-primary text-[10px] font-bold uppercase tracking-[1.5px] 
                   rounded-full dark:rounded-sharp      <!-- Round light, sharp dark -->
                   border border-transparent dark:border-accent-dark/30 
                   dark:text-text-dark dark:bg-primary-dark/20">
        React
      </span>
      <span class="px-3 py-1 
                   bg-surface-light dark:bg-surface-dark 
                   text-primary text-[10px] font-bold uppercase tracking-[1.5px] 
                   rounded-full dark:rounded-sharp 
                   border border-transparent dark:border-accent-dark/30 
                   dark:text-text-dark dark:bg-primary-dark/20">
        Python
      </span>
    </div>
  </div>
  
</article>
```

### When to Use Theme Classes vs Utilities

| Scenario | Use | Example |
|----------|-----|---------|
| **Simple color changes** | Dark mode utility | `bg-surface dark:bg-surface-dark` |
| **Different border-radius shapes** | `.theme-image-radius` | Arch vs sharp |
| **Shadow type changes** | `.theme-shadow` | Drop shadow vs neon glow |
| **Hover shadow enhancement** | `.theme-shadow-hover` | Combined with `.theme-shadow` |
| **Conditional borders** | `.theme-border` | Transparent vs cyan |
| **Text color changes** | Dark mode utility | `text-text-light dark:text-text-dark` |

---

## Quick Reference

### Layout Cheat Sheet

```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">...</div>

<!-- Grid (responsive) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">...</div>

<!-- Center horizontally -->
<div class="mx-auto max-w-[1200px]">...</div>

<!-- Full height -->
<div class="min-h-screen">...</div>
```

### Spacing Cheat Sheet

```html
<!-- Padding -->
<div class="p-4">All sides</div>
<div class="px-4 py-3">Horizontal + Vertical</div>
<div class="pt-2 pb-6">Top + Bottom individually</div>

<!-- Margin -->
<div class="mb-8">Bottom margin</div>
<div class="mt-4 mb-6">Top + Bottom</div>
<div class="mx-auto">Center horizontally</div>

<!-- Gap (for flex/grid) -->
<div class="flex gap-4">...</div>
<div class="grid grid-cols-3 gap-8">...</div>
```

### Typography Cheat Sheet

```html
<!-- Heading -->
<h1 class="font-heading text-5xl md:text-6xl mb-4">Title</h1>

<!-- Body text -->
<p class="text-lg leading-relaxed max-w-2xl">Body text...</p>

<!-- Muted text -->
<p class="text-muted-light dark:text-muted-dark text-sm">Secondary info</p>

<!-- Uppercase label -->
<span class="text-xs uppercase tracking-[1.5px] font-semibold">LABEL</span>

<!-- Truncate -->
<p class="line-clamp-2 text-sm">Long text truncated after 2 lines...</p>
```

### Color Cheat Sheet

```html
<!-- Background -->
<div class="bg-surface-light dark:bg-surface-dark">...</div>

<!-- Text -->
<h2 class="text-primary dark:text-primary-dark">Prominent text</h2>
<p class="text-text-light dark:text-text-dark">Regular text</p>
<p class="text-muted-light dark:text-muted-dark">Muted text</p>

<!-- Border -->
<div class="border-b border-primary dark:border-primary-dark">...</div>
```

### Effects Cheat Sheet

```html
<!-- Shadow -->
<div class="theme-shadow theme-shadow-hover">...</div>

<!-- Hover lift -->
<article class="hover:-translate-y-2 transition-transform duration-300">...</article>

<!-- Opacity change -->
<img class="opacity-90 group-hover:opacity-100 transition-opacity" />

<!-- Scale on hover -->
<button class="hover:scale-110 transition-transform">...</button>
```

### Responsive Cheat Sheet

```html
<!-- Show/hide by breakpoint -->
<nav class="hidden md:flex gap-9">Desktop nav</nav>
<button class="md:hidden">Mobile hamburger</button>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">...</div>

<!-- Responsive text size -->
<h1 class="text-4xl md:text-5xl lg:text-6xl">Headline</h1>

<!-- Responsive padding -->
<div class="px-4 md:px-10 lg:px-40 py-5">...</div>
```

### Dark Mode Cheat Sheet

```html
<!-- Page wrapper -->
<body class="bg-background-light dark:bg-background-dark 
             text-text-light dark:text-text-dark 
             transition-colors duration-300">...</body>

<!-- Card -->
<article class="bg-surface-light dark:bg-surface-dark p-6">...</article>

<!-- Links -->
<a class="text-text-light dark:text-text-dark 
          hover:text-primary dark:hover:text-primary-dark">Link</a>

<!-- Borders -->
<header class="border-b border-muted-light/20 dark:border-muted-dark/30">...</header>

<!-- Icons (conditional) -->
<span class="material-symbols-outlined dark:block hidden">dark_mode</span>
<span class="material-symbols-outlined light:block dark:hidden">light_mode</span>
```

---

## Migration Guide

### From Old Heritage CSS to Utility Classes

#### Before (Custom CSS)

```css
/* tool-card.css */
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s var(--easing);
}

.tool-card:hover {
  transform: translateY(-0.5rem);
  box-shadow: var(--shadow-lg);
}

[data-theme="dark"] .tool-card {
  background-color: var(--color-bg-secondary);
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.4);
}
```

**HTML:**
```html
<article class="tool-card">
  <h3>Card Title</h3>
  <p>Description...</p>
</article>
```

#### After (Utility Classes)

**HTML only (no custom CSS):**
```html
<article class="flex flex-col gap-4 p-6 
                bg-surface-light dark:bg-surface-dark 
                rounded-lg theme-shadow 
                transition-transform hover:-translate-y-2">
  <h3 class="font-heading text-2xl text-text-light dark:text-text-dark">
    Card Title
  </h3>
  <p class="text-muted-light dark:text-muted-dark text-sm">
    Description...
  </p>
</article>
```

**Benefits:**
- ✅ No unique CSS class needed
- ✅ Styling directly visible in HTML
- ✅ Responsive and theme-aware out of the box
- ✅ Easier to iterate and modify

---

### CSS Variable Mapping

| Old Variable | New Utility Class | Dark Variant |
|--------------|-------------------|--------------|
| `var(--color-bg-primary)` | `bg-background-light` | `dark:bg-background-dark` |
| `var(--color-bg-secondary)` | `bg-surface-light` | `dark:bg-surface-dark` |
| `var(--color-text-primary)` | `text-text-light` | `dark:text-text-dark` |
| `var(--color-text-secondary)` | `text-muted-light` | `dark:text-muted-dark` |
| `var(--color-accent)` | `text-primary` or `bg-primary` | `dark:text-primary-dark` |
| `var(--spacing-md)` | `p-4` or `gap-4` | — |
| `var(--spacing-lg)` | `p-6` or `gap-6` | — |
| `var(--radius-md)` | `rounded` or `rounded-lg` | — |
| `var(--shadow-md)` | `theme-shadow` | (auto-adapts) |

---

### Common Component Conversions

#### 1. Button

**Before:**
```css
.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: var(--color-accent-hover);
}
```

**After:**
```html
<button class="px-6 py-3 bg-primary dark:bg-primary-dark 
               text-white rounded-lg font-semibold cursor-pointer 
               hover:bg-accent-light dark:hover:bg-accent-dark 
               transition-colors">
  Click Me
</button>
```

---

#### 2. Input Field

**Before:**
```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
}

.input-field:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**After:**
```html
<input type="text" 
       class="w-full px-4 py-3 
              bg-surface-light dark:bg-surface-dark 
              border border-border-light dark:border-border-dark 
              rounded-lg 
              text-text-light dark:text-text-dark 
              text-base 
              focus:outline-2 focus:outline-primary focus:outline-offset-2" />
```

---

#### 3. Navigation Bar

**Before:**
```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.navbar-links {
  display: flex;
  gap: 2rem;
}

.navbar-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color 0.2s;
}

.navbar-link:hover {
  color: var(--color-text-primary);
}

.navbar-link.active {
  color: var(--color-accent);
  border-bottom: 2px solid var(--color-accent);
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }
}
```

**After:**
```html
<nav class="flex items-center justify-between px-8 py-4 
            bg-surface-light dark:bg-surface-dark 
            border-b border-muted-light/20 dark:border-muted-dark/30">
  
  <!-- Logo -->
  <div class="flex items-center gap-4">
    <span class="material-symbols-outlined text-primary dark:text-accent-dark">
      temple_hindu
    </span>
    <h2 class="font-heading text-2xl">DevToolbox</h2>
  </div>
  
  <!-- Links (hidden on mobile) -->
  <div class="hidden md:flex gap-8">
    <a href="#" class="text-text-light dark:text-text-dark 
                       hover:text-primary dark:hover:text-primary-dark 
                       transition-colors font-medium">
      Home
    </a>
    <a href="#" class="text-primary dark:text-primary-dark 
                       border-b-2 border-primary dark:border-primary-dark 
                       font-medium">
      Tools
    </a>
    <a href="#" class="text-text-light dark:text-text-dark 
                       hover:text-primary dark:hover:text-primary-dark 
                       transition-colors font-medium">
      About
    </a>
  </div>
</nav>
```

---

### Step-by-Step Migration Process

1. **Identify Component** - Find component in your HTML
2. **List CSS Properties** - Note all styles applied (padding, colors, layout, etc.)
3. **Map to Utility Classes** - Use this guide's reference tables
4. **Add Responsive Variants** - Add `md:` and `lg:` where needed
5. **Add Dark Mode Variants** - Add `dark:` for colors and theme classes
6. **Test Both Themes** - Verify light and dark modes look correct
7. **Remove Old CSS** - Delete custom CSS class once converted
8. **Document Changes** - Note conversion in commit message

---

## Summary

### Key Utility Families Designed

1. **Layout Utilities** - Flexbox, grid, positioning for component structure
2. **Spacing Utilities** - Padding, margin, gap for 8px grid system
3. **Typography Utilities** - Font size, weight, family, alignment for text hierarchy
4. **Color Utilities** - Background, text, border colors with full theme support
5. **Border & Radius Utilities** - Border width, style, radius including custom shapes
6. **Effect Utilities** - Shadows, opacity, transitions, transforms, filters for interactions
7. **Responsive Utilities** - `md:` and `lg:` prefixes for mobile-first design
8. **Dark Mode Utilities** - `dark:` prefix for seamless theme switching
9. **Custom Theme Classes** - `.theme-*` for mode-specific visual effects

### How Responsive System Works

- **Mobile-First Approach** - Base styles apply to all screens (320px+)
- **Breakpoint Prefixes** - `md:` for tablet (768px+), `lg:` for desktop (1024px+)
- **Stack to Side-by-Side** - Common pattern: `flex-col md:flex-row`
- **Responsive Grids** - Pattern: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Hide/Show** - Pattern: `hidden md:flex` or `md:hidden`

### How Dark Mode Variants Work

- **Class-Based Theming** - `.dark` class on `<html>` element
- **Dark Variant Syntax** - `.dark .dark\:bg-surface-dark { ... }`
- **HTML Usage** - `bg-surface-light dark:bg-surface-dark`
- **Automatic Switching** - Theme toggle JS adds/removes `.dark` class
- **System Preference Fallback** - `@media (prefers-color-scheme: dark)` for no-JS

### Decisions & Trade-offs

#### Decision 1: Vanilla CSS vs Tailwind CDN
**Chosen:** Vanilla CSS implementation  
**Rationale:** Maintains DevToolbox "zero frameworks" principle, full control over output  
**Trade-off:** More initial implementation work, but no external dependencies

#### Decision 2: Class-Based vs Attribute-Based Theming
**Chosen:** `.dark` class instead of `[data-theme="dark"]`  
**Rationale:** Industry standard (Tailwind, Next.js), better DX, simpler JS  
**Trade-off:** Requires migration of existing theme toggle logic

#### Decision 3: Utility Classes vs CSS-in-JS
**Chosen:** Utility classes (Tailwind-inspired)  
**Rationale:** No runtime overhead, works without JS, cacheable static CSS  
**Trade-off:** Longer class names in HTML, but more maintainable

#### Decision 4: Custom Theme Classes for Complex Effects
**Chosen:** Hybrid approach - utilities for simple styles, custom `.theme-*` for complex  
**Rationale:** Some effects (arch vs sharp, drop shadow vs glow) can't be done with simple utilities  
**Trade-off:** Slightly less "pure" utility approach, but more practical

#### Decision 5: Three Breakpoints Only
**Chosen:** Mobile (base), Tablet (md: 768px), Desktop (lg: 1024px)  
**Rationale:** Covers 95% of use cases, keeps system simple, reduces CSS bloat  
**Trade-off:** No `sm:` or `xl:` breakpoints, but can add later if needed

### Recommended Next Steps for Front-End Developer

1. **Phase 1.2: Implement Utilities**
   - Create `/shared/css/utilities.css` with all utility classes
   - Implement responsive variants (@media queries)
   - Implement dark mode variants (`.dark .dark\:*`)
   - Add custom theme classes (`.theme-*`)
   - Target file size: <50KB uncompressed

2. **Phase 1.3: Update Theme Toggle**
   - Migrate `/shared/js/theme-toggle.js` to use `.dark` class
   - Update localStorage key if needed
   - Add system preference fallback detection
   - Test theme persistence across page reloads

3. **Phase 1.4: Add Material Symbols**
   - Add Google Fonts link to all HTML files
   - Add Material Symbols icon font CSS
   - Test icon rendering in both themes

4. **Phase 1.5: Validate Foundation**
   - Test existing tools still work with new system
   - Verify theme toggle works on all pages
   - Check responsive breakpoints
   - Validate accessibility (color contrast, focus indicators)
   - Measure CSS bundle size (<50KB target)

5. **Phase 2: Homepage Redesign**
   - Apply utility classes to homepage redesign
   - Implement card grid with responsive columns
   - Add hover effects and theme classes
   - Test in both themes and all breakpoints

---

**Status:** ✅ Design Complete - Ready for Implementation  
**Next Agent:** @front-end-developer  
**Handoff Document:** This specification provides complete implementation details  

---

*Last Updated: March 23, 2026*
*Version: 2.0*
*Agent: ui-ux-architect*
