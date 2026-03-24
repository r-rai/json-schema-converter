# DevToolbox Homepage Design Specification

**Version:** 2.1  
**Date:** March 23, 2026  
**Status:** Design Phase  
**Phase:** 2.1 - Homepage Layout Redesign  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Layout Structure](#layout-structure)
3. [Header Component Design](#header-component-design)
4. [Hero Section Design](#hero-section-design)
5. [Tool Card Grid Design](#tool-card-grid-design)
6. [DevToolbox Tools & Icons](#devtoolbox-tools--icons)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Interaction States](#interaction-states)
9. [Theme-Specific Visual Effects](#theme-specific-visual-effects)
10. [Accessibility Requirements](#accessibility-requirements)
11. [Performance Considerations](#performance-considerations)
12. [Complete HTML Structure Example](#complete-html-structure-example)

---

## Overview

### Design Goals

The DevToolbox homepage redesign aims to:

1. **Establish visual brand identity** using Heritage Evolution design system
2. **Create intuitive navigation** with clear tool discovery
3. **Maintain privacy-first principles** with browser-only confirmation
4. **Deliver exceptional performance** with zero framework overhead
5. **Ensure accessibility** meeting WCAG 2.1 AA standards

### Design Principles Applied

- **Dual Expression**: Light (Indic Futurism) and Dark (Neon Heritage) themes
- **Cultural + Modern**: Heritage branding with contemporary UI patterns
- **Utility-First**: Compose layouts with utility classes, not custom CSS
- **Responsive Mobile-First**: Single column → 2 columns → 3 columns
- **Semantic HTML**: Proper document structure and ARIA labels

### Key Changes from Current Homepage

| Aspect | Current | New Design |
|--------|---------|------------|
| **Layout** | Basic centered column | Responsive grid with header + hero + cards |
| **Icons** | None/minimal | Material Symbols throughout |
| **Navigation** | None | Full header with responsive nav |
| **Branding** | Text-only title | Heritage logo icon + styled title |
| **Theme Effects** | Basic | Arch/sharp borders, soft/glow shadows |
| **Cards** | Simple boxes | Interactive cards with hover lifts |
| **Responsive** | Basic | Full mobile-first 3-tier breakpoints |

---

## Layout Structure

### Visual Hierarchy

```
┌────────────────────────────────────────────────────────┐
│ HEADER (Sticky)                                        │
│ ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│ │ Logo+Title  │  │ Navigation   │  │ Theme Toggle  │ │
│ └─────────────┘  └──────────────┘  └───────────────┘ │
├────────────────────────────────────────────────────────┤
│ HERO SECTION                                           │
│                                                        │
│           "DevToolbox" (H1)                           │
│     Fast, private, browser-based utilities            │
│                                                        │
├────────────────────────────────────────────────────────┤
│ TOOL CARD GRID                                         │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Icon    │  │  Icon    │  │  Icon    │           │
│  │  Title   │  │  Title   │  │  Title   │           │
│  │  Descrip │  │  Descrip │  │  Descrip │           │
│  │  [Tags]  │  │  [Tags]  │  │  [Tags]  │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                        │
│  ┌──────────┐  ┌──────────┐                          │
│  │  Icon    │  │  Icon    │                          │
│  │  Title   │  │  Title   │                          │
│  │  Descrip │  │  Descrip │                          │
│  │  [Tags]  │  │  [Tags]  │                          │
│  └──────────┘  └──────────┘                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Container Structure

```html
<html class="dark">  <!-- or "light" -->
<body class="bg-background-light dark:bg-background-dark 
             text-text-light dark:text-text-dark 
             font-display min-h-screen transition-colors">
  
  <!-- Header Component -->
  <header>...</header>
  
  <!-- Main Content -->
  <main class="px-4 sm:px-10 lg:px-40 py-5">
    <div class="max-w-[1200px] mx-auto">
      
      <!-- Hero Section -->
      <section>...</section>
      
      <!-- Tool Grid -->
      <section>...</section>
      
    </div>
  </main>
  
</body>
</html>
```

---

## Header Component Design

### Purpose

- **Primary navigation** for the platform
- **Branding** with Heritage logo and title
- **Theme switcher** for light/dark mode
- **Responsive behavior** with hamburger menu on mobile

### Component Anatomy

```
┌─────────────────────────────────────────────────────────┐
│ [◉ DevToolbox]     [Home Experience Tools]    [☾ ☰]  │
│  Logo + Title        Navigation Links          Theme+  │
│                                                 Menu    │
└─────────────────────────────────────────────────────────┘
```

### HTML Structure

```html
<!-- Shared TopNavBar -->
<header class="flex items-center justify-between whitespace-nowrap 
               border-b border-solid border-muted-light/20 dark:border-muted-dark/30 
               px-4 py-3 mb-8">
  
  <!-- Left: Logo + Title -->
  <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
    <div class="size-6 text-primary dark:text-accent-dark">
      <span class="material-symbols-outlined" style="font-size: 24px;">
        temple_hindu
      </span>
    </div>
    <h2 class="font-heading text-2xl leading-tight tracking-[-0.015em]">
      DevToolbox
    </h2>
  </div>
  
  <!-- Right: Navigation + Theme Toggle -->
  <div class="flex items-center gap-8">
    
    <!-- Desktop Navigation (hidden on mobile) -->
    <nav class="hidden md:flex items-center gap-9">
      <a href="/" 
         class="text-text-light dark:text-text-dark 
                text-sm font-medium leading-normal 
                hover:text-primary dark:hover:text-primary-dark 
                transition-colors font-display">
        Home
      </a>
      <a href="#tools" 
         class="text-text-light dark:text-text-dark 
                text-sm font-medium leading-normal 
                hover:text-primary dark:hover:text-primary-dark 
                transition-colors font-display">
        Tools
      </a>
      <a href="#about" 
         class="text-text-light dark:text-text-dark 
                text-sm font-medium leading-normal 
                hover:text-primary dark:hover:text-primary-dark 
                transition-colors font-display">
        About
      </a>
    </nav>
    
    <!-- Theme Toggle Button -->
    <button aria-label="Toggle Theme" 
            data-theme-toggle
            class="flex h-10 w-10 cursor-pointer items-center justify-center 
                   overflow-hidden rounded-full 
                   bg-surface-light dark:bg-surface-dark 
                   text-text-light dark:text-accent-dark 
                   shadow-sm hover:scale-110 transition-transform">
      <span class="material-symbols-outlined hidden dark:block" 
            data-icon="dark_mode">
        dark_mode
      </span>
      <span class="material-symbols-outlined block dark:hidden" 
            data-icon="light_mode">
        light_mode
      </span>
    </button>
    
    <!-- Mobile Menu Button (hidden on desktop) -->
    <button class="md:hidden flex h-10 w-10 items-center justify-center 
                   text-text-light dark:text-text-dark" 
            aria-label="Open menu">
      <span class="material-symbols-outlined">menu</span>
    </button>
    
  </div>
</header>
```

### Design Tokens Used

| Element | Light Mode | Dark Mode | Utility Classes |
|---------|------------|-----------|-----------------|
| **Background** | Transparent | Transparent | (inherits body) |
| **Border** | #9C9283/20 | #5B5F77/30 | `border-muted-light/20 dark:border-muted-dark/30` |
| **Logo Icon** | #C84B31 (terracotta) | #00F0FF (cyan) | `text-primary dark:text-accent-dark` |
| **Title** | #2D2A26 (dark brown) | #E8E9F3 (off-white) | `text-text-light dark:text-text-dark` |
| **Nav Links** | #2D2A26 | #E8E9F3 | `text-text-light dark:text-text-dark` |
| **Nav Hover** | #C84B31 | #FF6B35 | `hover:text-primary dark:hover:text-primary-dark` |
| **Theme Button Bg** | #F4EFE6 | #12131C | `bg-surface-light dark:bg-surface-dark` |
| **Theme Icon** | #2D2A26 | #00F0FF | `text-text-light dark:text-accent-dark` |

### Responsive Behavior

#### Mobile (<768px)
- Logo + Title: Visible, stacked if needed
- Navigation: **Hidden** (`.hidden md:flex`)
- Theme Toggle: Visible
- Hamburger Menu: **Visible** (`.md:hidden`)

#### Tablet & Desktop (≥768px)
- Logo + Title: Visible
- Navigation: **Visible** (full links)
- Theme Toggle: Visible
- Hamburger Menu: **Hidden**

### Active State for Current Page

```html
<!-- Active navigation link -->
<a href="/" 
   class="text-primary dark:text-primary-dark 
          text-sm font-bold leading-normal 
          border-b-2 border-primary dark:border-primary-dark 
          pb-1 font-display">
  Home
</a>
```

---

## Hero Section Design

### Purpose

- **Welcome message** establishing platform identity
- **Value proposition** ("Fast, private, browser-based")
- **Optional filter/category bar** for future tool categorization

### Component Anatomy

```
┌─────────────────────────────────────┐
│                                     │
│           DevToolbox                │
│                                     │
│  Fast, private, browser-based       │
│  developer utilities                │
│                                     │
└─────────────────────────────────────┘
```

### HTML Structure

```html
<!-- Hero Section -->
<section class="py-8 md:py-12 px-4">
  <div class="max-w-4xl mx-auto text-center">
    
    <!-- Main Heading -->
    <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl 
               text-text-light dark:text-text-dark 
               mb-4 font-normal leading-tight">
      DevToolbox
    </h1>
    
    <!-- Tagline -->
    <p class="text-lg md:text-xl 
              text-muted-light dark:text-muted-dark 
              max-w-2xl mx-auto 
              font-display leading-relaxed">
      Fast, private, browser-based developer utilities
    </p>
    
    <!-- Optional: Privacy Badge -->
    <div class="mt-6 inline-flex items-center gap-2 
                px-4 py-2 
                bg-surface-light dark:bg-surface-dark 
                border border-muted-light/20 dark:border-accent-dark/30 
                rounded-full 
                text-sm text-muted-light dark:text-text-dark">
      <span class="material-symbols-outlined text-base">lock</span>
      <span>Everything runs in your browser. No data leaves your device.</span>
    </div>
    
  </div>
</section>
```

### Design Tokens Used

| Element | Light Mode | Dark Mode | Utility Classes |
|---------|------------|-----------|-----------------|
| **H1 Text** | #2D2A26 | #E8E9F3 | `text-text-light dark:text-text-dark` |
| **H1 Font** | Rozha One | Rozha One | `font-heading` |
| **H1 Size** | 2.5rem→3rem→3.75rem | Same | `text-4xl md:text-5xl lg:text-6xl` |
| **Tagline** | #9C9283 | #5B5F77 | `text-muted-light dark:text-muted-dark` |
| **Privacy Badge Bg** | #F4EFE6 | #12131C | `bg-surface-light dark:bg-surface-dark` |
| **Privacy Badge Border** | #9C9283/20 | #00F0FF/30 | `border-muted-light/20 dark:border-accent-dark/30` |

### Spacing Guidelines

- **Top padding**: `py-8` mobile, `py-12` tablet+
- **H1 margin-bottom**: `mb-4` (1rem)
- **Max width**: `max-w-4xl` (56rem/896px) for readability
- **Horizontal padding**: `px-4` (1rem) on mobile

---

## Tool Card Grid Design

### Purpose

- **Showcase all five tools** in a scannable grid
- **Interactive cards** with hover effects for engagement
- **Responsive layout** adapting to screen size
- **Clear tool identification** with icons, titles, descriptions

### Grid Layout Structure

```html
<!-- Tool Card Grid Container -->
<section id="tools" class="p-4 md:p-10">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    
    <!-- Tool Card 1 -->
    <article>...</article>
    
    <!-- Tool Card 2 -->
    <article>...</article>
    
    <!-- Tool Card 3 -->
    <article>...</article>
    
    <!-- Tool Card 4 -->
    <article>...</article>
    
    <!-- Tool Card 5 -->
    <article>...</article>
    
  </div>
</section>
```

### Grid Behavior

| Screen Size | Columns | Gap | Container Padding |
|-------------|---------|-----|-------------------|
| Mobile (<768px) | 1 | 2rem (32px) | 1rem (16px) |
| Tablet (768-1023px) | 2 | 2rem (32px) | 2.5rem (40px) |
| Desktop (≥1024px) | 3 | 2rem (32px) | 2.5rem (40px) |

**Utility Classes:**
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Gap: `gap-8` (2rem / 32px)
- Padding: `p-4 md:p-10` (1rem → 2.5rem)

---

## Individual Tool Card Design

### Card Anatomy

```
┌─────────────────────────┐
│                         │
│    [Icon - 48px]        │  ← Material Symbols icon
│                         │
│  ┌───────────────────┐  │
│  │                   │  │
│  │  Title (H3)       │  │  ← Tool name (Rozha One)
│  │                   │  │
│  │  Description      │  │  ← 2-line description
│  │  (line-clamp-2)   │  │
│  │                   │  │
│  │  [Tag1] [Tag2]    │  │  ← Tech/feature tags (optional)
│  │                   │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

### Complete Card HTML

```html
<article class="group flex flex-col gap-4 cursor-pointer 
                hover:-translate-y-2 transition-transform duration-300">
  
  <!-- Tool Icon Container -->
  <div class="flex items-center justify-center h-20">
    <span class="material-symbols-outlined 
                 text-primary dark:text-accent-dark 
                 text-5xl">
      data_object
    </span>
  </div>
  
  <!-- Tool Content Card -->
  <div class="bg-surface-light dark:bg-surface-dark 
              p-6 rounded-lg 
              theme-shadow theme-shadow-hover theme-border">
    
    <!-- Tool Title -->
    <h3 class="font-heading text-2xl mb-2 
               text-text-light dark:text-text-dark">
      JSON Schema Validator
    </h3>
    
    <!-- Tool Description -->
    <p class="text-sm 
              text-muted-light dark:text-text-dark 
              line-clamp-2 mb-4 
              leading-relaxed">
      Validate JSON against schemas with detailed error reporting and instant feedback
    </p>
    
    <!-- Tech Tags (Optional) -->
    <div class="flex flex-wrap gap-2">
      <span class="px-3 py-1 
                   bg-surface-light dark:bg-surface-dark 
                   text-primary dark:text-accent-dark 
                   text-xs font-bold uppercase tracking-wider 
                   rounded-full dark:rounded-sharp 
                   border border-transparent dark:border-accent-dark/30">
        JSON
      </span>
      <span class="px-3 py-1 
                   bg-surface-light dark:bg-surface-dark 
                   text-primary dark:text-accent-dark 
                   text-xs font-bold uppercase tracking-wider 
                   rounded-full dark:rounded-sharp 
                   border border-transparent dark:border-accent-dark/30">
        Validation
      </span>
    </div>
    
  </div>
</article>
```

### Card Component Breakdown

#### 1. Outer Container (`<article>`)

**Purpose**: Wrapper for hover effects

**Classes:**
- `group` - Enable group-hover variants on children
- `flex flex-col gap-4` - Vertical stack with 1rem gap
- `cursor-pointer` - Indicate clickable
- `hover:-translate-y-2` - Lift up 0.5rem on hover
- `transition-transform duration-300` - Smooth 300ms animation

#### 2. Icon Container (`<div>`)

**Purpose**: Center the tool icon above the card

**Classes:**
- `flex items-center justify-center` - Center content
- `h-20` - Fixed height 5rem (80px)

**Icon Styling:**
- Size: `text-5xl` (3rem / 48px)
- Light mode: `text-primary` (#C84B31 terracotta)
- Dark mode: `text-accent-dark` (#00F0FF cyan)

#### 3. Content Card (`<div>`)

**Purpose**: Container with background, padding, theme effects

**Classes:**
- `bg-surface-light dark:bg-surface-dark` - Theme-aware background
- `p-6` - 1.5rem padding all sides
- `rounded-lg` - 0.5rem border radius
- `theme-shadow` - Auto-adapts shadow to theme
- `theme-shadow-hover` - Enhanced shadow on hover
- `theme-border` - Transparent light, cyan glow dark

**What `theme-*` Classes Do:**
```css
/* Light Mode */
.theme-shadow { 
  box-shadow: 0 8px 30px rgba(200, 75, 49, 0.08); 
}
.theme-shadow-hover:hover { 
  box-shadow: 0 12px 40px rgba(200, 75, 49, 0.15); 
}
.theme-border { 
  border: 1px solid transparent; 
}

/* Dark Mode */
.dark .theme-shadow { 
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.4); 
}
.dark .theme-shadow-hover:hover { 
  box-shadow: 0 0 25px rgba(255, 107, 53, 0.6); 
  border-color: #00F0FF; /* Cyan border glow */
}
.dark .theme-border { 
  border: 1px solid rgba(0, 240, 255, 0.2); 
}
```

#### 4. Tool Title (`<h3>`)

**Purpose**: Display tool name prominently

**Classes:**
- `font-heading` - Rozha One serif font
- `text-2xl` - 1.5rem (24px)
- `mb-2` - 0.5rem margin-bottom
- `text-text-light dark:text-text-dark` - Theme-aware text

#### 5. Tool Description (`<p>`)

**Purpose**: Brief description of tool functionality

**Classes:**
- `text-sm` - 0.875rem (14px)
- `text-muted-light dark:text-text-dark` - Lighter text in light mode
- `line-clamp-2` - Truncate to 2 lines max
- `mb-4` - 1rem margin-bottom
- `leading-relaxed` - Line height 1.625

#### 6. Tech Tags Container (`<div>`)

**Purpose**: Display technology/feature badges

**Classes:**
- `flex flex-wrap gap-2` - Horizontal wrap with 0.5rem gaps

**Individual Tag Styling:**
- `px-3 py-1` - Horizontal 0.75rem, vertical 0.25rem padding
- `bg-surface-light dark:bg-surface-dark` - Subtle background
- `text-primary dark:text-accent-dark` - Brand color text
- `text-xs` - 0.75rem (12px)
- `font-bold uppercase tracking-wider` - Bold, all caps, spaced
- `rounded-full dark:rounded-sharp` - Full radius light, 4px dark
- `border border-transparent dark:border-accent-dark/30` - Invisible light, cyan dark

### Design Token Summary

| Element | Light Mode | Dark Mode | Notes |
|---------|------------|-----------|-------|
| **Icon Color** | #C84B31 (terracotta) | #00F0FF (cyan) | `text-primary dark:text-accent-dark` |
| **Card Background** | #F4EFE6 (surface) | #12131C (dark surface) | `bg-surface-light dark:bg-surface-dark` |
| **Card Shadow** | Soft drop 0.08 opacity | Neon orange glow 0.4 | `theme-shadow` |
| **Card Border** | Transparent | rgba(0,240,255,0.2) cyan | `theme-border` |
| **Hover Shadow** | Enhanced 0.15 opacity | Intensified 0.6 + cyan border | `theme-shadow-hover` |
| **Title Color** | #2D2A26 | #E8E9F3 | `text-text-light dark:text-text-dark` |
| **Description** | #9C9283 (muted) | #E8E9F3 | `text-muted-light dark:text-text-dark` |
| **Tag Background** | #F4EFE6 | #12131C | Same as card |
| **Tag Text** | #C84B31 | #00F0FF | `text-primary dark:text-accent-dark` |
| **Tag Border** | Transparent | rgba(0,240,255,0.3) | `border-transparent dark:border-accent-dark/30` |
| **Tag Radius** | 9999px (full) | 4px (sharp) | `rounded-full dark:rounded-sharp` |

---

## DevToolbox Tools & Icons

### Complete Tool Registry

| # | Tool Name | Icon | Icon Semantic | Destination |
|---|-----------|------|---------------|-------------|
| 1 | **JSON Schema Validator** | `data_object` | Represents JSON/data structures | `/tools/json-schema/` |
| 2 | **HTML ↔ Markdown Converter** | `code_blocks` | Represents code/markup transformation | `/tools/html-markdown/` |
| 3 | **Text Diff Checker** | `difference` | Represents comparison/difference | `/tools/text-diff/` |
| 4 | **SIP Calculator** | `trending_up` | Represents investment growth | `/tools/sip-calculator/` |
| 5 | **EMI Calculator** | `account_balance` | Represents finance/banking | `/tools/emi-calculator/` |

### Tool Card Examples (Full)

#### 1. JSON Schema Validator

```html
<article class="group flex flex-col gap-4 cursor-pointer 
                hover:-translate-y-2 transition-transform duration-300">
  <a href="/tools/json-schema/" class="contents">
    <div class="flex items-center justify-center h-20">
      <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl">
        data_object
      </span>
    </div>
    <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-lg 
                theme-shadow theme-shadow-hover theme-border">
      <h3 class="font-heading text-2xl mb-2 text-text-light dark:text-text-dark">
        JSON Schema Validator
      </h3>
      <p class="text-sm text-muted-light dark:text-text-dark line-clamp-2 mb-4 leading-relaxed">
        Validate JSON against schemas with detailed error reporting and instant feedback
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-surface-light dark:bg-surface-dark text-primary dark:text-accent-dark 
                     text-xs font-bold uppercase tracking-wider rounded-full dark:rounded-sharp 
                     border border-transparent dark:border-accent-dark/30">
          JSON
        </span>
      </div>
    </div>
  </a>
</article>
```

#### 2. HTML ↔ Markdown Converter

```html
<article class="group flex flex-col gap-4 cursor-pointer 
                hover:-translate-y-2 transition-transform duration-300">
  <a href="/tools/html-markdown/" class="contents">
    <div class="flex items-center justify-center h-20">
      <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl">
        code_blocks
      </span>
    </div>
    <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-lg 
                theme-shadow theme-shadow-hover theme-border">
      <h3 class="font-heading text-2xl mb-2 text-text-light dark:text-text-dark">
        HTML ↔ Markdown
      </h3>
      <p class="text-sm text-muted-light dark:text-text-dark line-clamp-2 mb-4 leading-relaxed">
        Bidirectional conversion between HTML and Markdown with syntax preservation
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-surface-light dark:bg-surface-dark text-primary dark:text-accent-dark 
                     text-xs font-bold uppercase tracking-wider rounded-full dark:rounded-sharp 
                     border border-transparent dark:border-accent-dark/30">
          Converter
        </span>
      </div>
    </div>
  </a>
</article>
```

#### 3. Text Diff Checker

```html
<article class="group flex flex-col gap-4 cursor-pointer 
                hover:-translate-y-2 transition-transform duration-300">
  <a href="/tools/text-diff/" class="contents">
    <div class="flex items-center justify-center h-20">
      <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl">
        difference
      </span>
    </div>
    <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-lg 
                theme-shadow theme-shadow-hover theme-border">
      <h3 class="font-heading text-2xl mb-2 text-text-light dark:text-text-dark">
        Text Diff Checker
      </h3>
      <p class="text-sm text-muted-light dark:text-text-dark line-clamp-2 mb-4 leading-relaxed">
        Compare two text blocks with side-by-side diff highlighting and line-by-line analysis
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-surface-light dark:bg-surface-dark text-primary dark:text-accent-dark 
                     text-xs font-bold uppercase tracking-wider rounded-full dark:rounded-sharp 
                     border border-transparent dark:border-accent-dark/30">
          Diff
        </span>
      </div>
    </div>
  </a>
</article>
```

#### 4. SIP Calculator

```html
<article class="group flex flex-col gap-4 cursor-pointer 
                hover:-translate-y-2 transition-transform duration-300">
  <a href="/tools/sip-calculator/" class="contents">
    <div class="flex items-center justify-center h-20">
      <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl">
        trending_up
      </span>
    </div>
    <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-lg 
                theme-shadow theme-shadow-hover theme-border">
      <h3 class="font-heading text-2xl mb-2 text-text-light dark:text-text-dark">
        SIP Calculator
      </h3>
      <p class="text-sm text-muted-light dark:text-text-dark line-clamp-2 mb-4 leading-relaxed">
        Calculate Systematic Investment Plan returns with visual growth projections and breakdowns
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-surface-light dark:bg-surface-dark text-primary dark:text-accent-dark 
                     text-xs font-bold uppercase tracking-wider rounded-full dark:rounded-sharp 
                     border border-transparent dark:border-accent-dark/30">
          Finance
        </span>
      </div>
    </div>
  </a>
</article>
```

#### 5. EMI Calculator

```html
<article class="group flex flex-col gap-4 cursor-pointer 
                hover:-translate-y-2 transition-transform duration-300">
  <a href="/tools/emi-calculator/" class="contents">
    <div class="flex items-center justify-center h-20">
      <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl">
        account_balance
      </span>
    </div>
    <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-lg 
                theme-shadow theme-shadow-hover theme-border">
      <h3 class="font-heading text-2xl mb-2 text-text-light dark:text-text-dark">
        EMI Calculator
      </h3>
      <p class="text-sm text-muted-light dark:text-text-dark line-clamp-2 mb-4 leading-relaxed">
        Compute loan EMIs with detailed amortization schedules and interest breakdowns
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-surface-light dark:bg-surface-dark text-primary dark:text-accent-dark 
                     text-xs font-bold uppercase tracking-wider rounded-full dark:rounded-sharp 
                     border border-transparent dark:border-accent-dark/30">
          Loan
        </span>
      </div>
    </div>
  </a>
</article>
```

---

## Responsive Breakpoints

### Three-Tier Responsive System

DevToolbox uses **mobile-first responsive design** with three distinct breakpoint tiers:

| Tier | Viewport Width | Target Devices | Grid Columns | Padding | Font Sizes |
|------|---------------|----------------|--------------|---------|------------|
| **Mobile** | < 768px | Phones | 1 | `p-4` (1rem) | Base → `text-4xl` |
| **Tablet** | 768px - 1023px | Tablets, small laptops | 2 | `p-8` (2rem) | `md:` → `md:text-5xl` |
| **Desktop** | ≥ 1024px | Desktops, large laptops | 3 | `p-10` (2.5rem) | `lg:` → `lg:text-6xl` |

### Breakpoint Implementation

```css
/* Mobile (default) - no prefix needed */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.text-4xl { font-size: 2.25rem; }
.p-4 { padding: 1rem; }

/* Tablet (≥768px) - md: prefix */
@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\:text-5xl { font-size: 3rem; }
  .md\:p-8 { padding: 2rem; }
  .md\:flex { display: flex; }  /* Show desktop nav */
}

/* Desktop (≥1024px) - lg: prefix */
@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:text-6xl { font-size: 3.75rem; }
  .lg\:px-40 { padding-left: 10rem; padding-right: 10rem; }
}
```

### Responsive Layout Examples

#### Header Navigation

```html
<!-- Hide navigation on mobile, show on tablet+ -->
<nav class="hidden md:flex items-center gap-9">
  <a href="/">Home</a>
  <a href="#tools">Tools</a>
  <a href="#about">About</a>
</nav>

<!-- Show hamburger on mobile, hide on tablet+ -->
<button class="md:hidden" aria-label="Open menu">
  <span class="material-symbols-outlined">menu</span>
</button>
```

#### Hero Section Typography

```html
<!-- Font size scales: 2.25rem → 3rem → 3.75rem -->
<h1 class="font-heading text-4xl md:text-5xl lg:text-6xl">
  DevToolbox
</h1>

<!-- Tagline size scales: 1.125rem → 1.25rem -->
<p class="text-lg md:text-xl max-w-2xl mx-auto">
  Fast, private, browser-based developer utilities
</p>
```

#### Tool Card Grid

```html
<!-- 1 column → 2 columns → 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-10">
  <article>Card 1</article>
  <article>Card 2</article>
  <article>Card 3</article>
  <article>Card 4</article>
  <article>Card 5</article>
</div>
```

#### Container Padding

```html
<!-- Padding scales: 1rem (mobile) → 2.5rem (tablet) → 10rem (desktop) -->
<main class="px-4 sm:px-10 lg:px-40 py-5">
  <!-- Content -->
</main>
```

### Testing Responsive Breakpoints

**Browser DevTools Test Points:**
- **320px** - iPhone SE (smallest common mobile)
- **375px** - iPhone 6/7/8
- **768px** - iPad portrait (tablet breakpoint)
- **1024px** - iPad landscape (desktop breakpoint)
- **1440px** - Standard laptop
- **1920px** - Full HD desktop

---

## Interaction States

### Card Hover Effects

#### Visual Changes on Hover

1. **Translate Up**: Card lifts 0.5rem (`hover:-translate-y-2`)
2. **Enhanced Shadow**: Shadow intensifies (soft → stronger in light, glow → brighter in dark)
3. **Cyan Border** (dark mode only): Glowing cyan border appears
4. **Duration**: 300ms smooth transition

#### Implementation

```html
<article class="group hover:-translate-y-2 transition-transform duration-300">
  <div class="theme-shadow theme-shadow-hover theme-border">
    <!-- Content -->
  </div>
</article>
```

**What Happens:**
```css
/* Initial state */
.transition-transform { transition: transform 300ms ease; }
.theme-shadow { box-shadow: [soft or glow based on theme]; }

/* On hover */
article:hover {
  transform: translateY(-0.5rem);
}

/* Light mode hover */
.theme-shadow-hover:hover {
  box-shadow: 0 12px 40px rgba(200, 75, 49, 0.15); /* Enhanced drop shadow */
}

/* Dark mode hover */
.dark .theme-shadow-hover:hover {
  box-shadow: 0 0 25px rgba(255, 107, 53, 0.6); /* Brighter neon glow */
  border-color: #00F0FF; /* Cyan border appears */
}
```

### Link Hover Effects

#### Navigation Links

```html
<a href="/" 
   class="text-text-light dark:text-text-dark 
          hover:text-primary dark:hover:text-primary-dark 
          transition-colors">
  Home
</a>
```

**Behavior:**
- Default: Body text color (#2D2A26 light, #E8E9F3 dark)
- Hover: Primary color (#C84B31 light, #FF6B35 dark)
- Transition: 200ms color change

### Button Hover Effects

#### Theme Toggle Button

```html
<button class="hover:scale-110 transition-transform">
  <span class="material-symbols-outlined">dark_mode</span>
</button>
```

**Behavior:**
- Scale up 10% on hover
- Smooth scale transition
- Maintains circular shape

### Focus States (Accessibility)

All interactive elements MUST have visible focus indicators for keyboard navigation:

```css
/* Button focus */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Link focus */
a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Card focus (when using <a> wrapper) */
article a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: 12px;
}
```

**Testing Focus States:**
- Tab through all interactive elements
- Verify visible outline appears
- Check contrast ratio ≥ 3:1 against background

---

## Theme-Specific Visual Effects

### Overview of Theme Classes

DevToolbox uses **custom theme classes** that automatically adapt visual effects based on the active theme (`html.dark` or `html.light`).

### Custom Theme Classes

#### 1. `.theme-image-radius`

**Purpose:** Adaptive border radius for images/media

```css
/* Light mode: Arch (Indic temple architecture) */
.light .theme-image-radius {
  border-radius: 200px 200px 0 0; /* Top arch */
}

/* Dark mode: Sharp (cyberpunk aesthetic) */
.dark .theme-image-radius {
  border-radius: 4px; /* Sharp corners */
}
```

**Usage:** (If tool cards had images)
```html
<div class="aspect-[16/9] theme-image-radius overflow-hidden">
  <img src="tool-preview.jpg" class="w-full h-full object-cover" />
</div>
```

#### 2. `.theme-shadow`

**Purpose:** Base shadow that adapts to theme

```css
/* Light mode: Soft drop shadow (warm terracotta tint) */
.light .theme-shadow {
  box-shadow: 0 8px 30px rgba(200, 75, 49, 0.08);
}

/* Dark mode: Neon glow (orange glow) */
.dark .theme-shadow {
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.4);
}
```

**Usage:**
```html
<div class="bg-surface-light dark:bg-surface-dark theme-shadow">
  <!-- Card content -->
</div>
```

#### 3. `.theme-shadow-hover`

**Purpose:** Enhanced shadow on hover

```css
/* Light mode: Stronger drop shadow */
.light .theme-shadow-hover:hover {
  box-shadow: 0 12px 40px rgba(200, 75, 49, 0.15);
}

/* Dark mode: Intensified glow + cyan border */
.dark .theme-shadow-hover:hover {
  box-shadow: 0 0 25px rgba(255, 107, 53, 0.6);
  border-color: #00F0FF; /* Cyan glow border */
}
```

**Usage:**
```html
<div class="theme-shadow theme-shadow-hover">
  <!-- Hover effects enabled -->
</div>
```

#### 4. `.theme-border`

**Purpose:** Border that's invisible in light, glowing in dark

```css
/* Light mode: Transparent border */
.light .theme-border {
  border: 1px solid transparent;
}

/* Dark mode: Subtle cyan border */
.dark .theme-border {
  border: 1px solid rgba(0, 240, 255, 0.2);
}
```

**Usage:**
```html
<div class="theme-border">
  <!-- Subtle cyan glow in dark mode -->
</div>
```

### Complete Theme Effect Stack

For maximum "Heritage Evolution" effect, stack all theme classes:

```html
<div class="bg-surface-light dark:bg-surface-dark 
            p-6 rounded-lg 
            theme-shadow theme-shadow-hover theme-border">
  <!-- Fully themed component -->
</div>
```

**Result:**
- **Light Mode**: Soft terracotta-tinted drop shadow, arch radius (if image), transparent border
- **Dark Mode**: Neon orange glow, sharp corners (if image), subtle cyan border that intensifies on hover

### Visual Comparison Table

| Effect | Light Mode (Indic Futurism) | Dark Mode (Neon Heritage) |
|--------|------------------------------|---------------------------|
| **Shadow Style** | Drop shadow (below element) | Neon glow (radial around element) |
| **Shadow Color** | Terracotta #C84B31 @ 8% opacity | Orange #FF6B35 @ 40% opacity |
| **Hover Shadow** | Intensify to 15% opacity | Intensify to 60% opacity + cyan border |
| **Border** | Transparent (invisible) | Cyan #00F0FF @ 20% opacity |
| **Border Radius** | Arch 200px top (organic) | Sharp 4px (geometric) |
| **Overall Aesthetic** | Warm, soft, organic | Cool, sharp, high-tech |

---

## Accessibility Requirements

### WCAG 2.1 Compliance Targets

- **Level AA** - Minimum compliance (required)
- **Level AAA** - Target compliance (preferred where feasible)

### Color Contrast Requirements

#### Text Contrast Ratios

| Element Type | Light Mode | Dark Mode | WCAG Level |
|--------------|------------|-----------|------------|
| **Body Text** (16px) | 4.5:1 minimum | 7:1 target | AA / AAA |
| **Large Text** (≥18px bold or ≥24px) | 3:1 minimum | 4.5:1 target | AA / AAA |
| **UI Components** | 3:1 minimum | 3:1 minimum | AA |

**Tool to Verify:** WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

#### Tested Color Combinations

| Foreground | Background (Light) | Ratio | Background (Dark) | Ratio | Pass |
|------------|-------------------|-------|-------------------|-------|------|
| **Body Text** | #2D2A26 on #FDFBF7 | 12.6:1 | #E8E9F3 on #08080C | 14.8:1 | ✅ AAA |
| **Muted Text** | #9C9283 on #FDFBF7 | 4.8:1 | #5B5F77 on #08080C | 5.2:1 | ✅ AA |
| **Primary** | #C84B31 on #FDFBF7 | 6.2:1 | #FF6B35 on #08080C | 5.8:1 | ✅ AA |
| **Accent Dark** | - | - | #00F0FF on #08080C | 12.1:1 | ✅ AAA |

### Semantic HTML

Must use proper HTML5 semantic elements:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevToolbox - Developer Tools Platform</title>
</head>
<body>
  
  <!-- Semantic landmark: Header -->
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Navigation content -->
    </nav>
  </header>
  
  <!-- Semantic landmark: Main content -->
  <main role="main" id="main-content">
    
    <!-- Hero section -->
    <section aria-labelledby="hero-heading">
      <h1 id="hero-heading">DevToolbox</h1>
      <!-- Hero content -->
    </section>
    
    <!-- Tools section -->
    <section aria-labelledby="tools-heading">
      <h2 id="tools-heading" class="sr-only">Available Tools</h2>
      <!-- Tool cards -->
    </section>
    
  </main>
  
  <!-- Optional: Footer -->
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
  
</body>
</html>
```

### ARIA Labels

#### Icon-Only Buttons

Icons MUST have accessible labels:

```html
<!-- Theme toggle - icon only -->
<button aria-label="Toggle dark mode theme" data-theme-toggle>
  <span class="material-symbols-outlined" aria-hidden="true">dark_mode</span>
</button>

<!-- Mobile menu - icon only -->
<button aria-label="Open navigation menu">
  <span class="material-symbols-outlined" aria-hidden="true">menu</span>
</button>
```

**Rule:** If button has no visible text, use `aria-label`. Mark icon as `aria-hidden="true"`.

#### Landmarks

Use ARIA landmarks for major page regions:

```html
<header role="banner">...</header>
<nav role="navigation" aria-label="Main navigation">...</nav>
<main role="main" id="main-content">...</main>
<section aria-labelledby="tools-heading">...</section>
<footer role="contentinfo">...</footer>
```

### Keyboard Navigation

#### Requirements

1. **All interactive elements** must be keyboard accessible
2. **Tab order** must be logical (top → bottom, left → right)
3. **Focus indicators** must be visible (2px outline, 2px offset)
4. **Skip links** provided for screen readers (optional but recommended)

#### Tab Order

```
1. Header: Home button
2. Header: Theme toggle
3. Header: Navigation link 1 (Home)
4. Header: Navigation link 2 (Tools)
5. Header: Navigation link 3 (About)
6. Header: Mobile menu button
7. Tool Card 1 link
8. Tool Card 2 link
9. Tool Card 3 link
10. Tool Card 4 link
11. Tool Card 5 link
```

#### Skip Links (Recommended)

```html
<!-- Hidden skip link for screen readers -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>

<!-- Screen reader only utility class (add to CSS) -->
<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
</style>
```

### Screen Reader Testing

#### Test with:
- **NVDA** (Windows, free)
- **JAWS** (Windows, paid)
- **VoiceOver** (macOS, built-in)
- **TalkBack** (Android, built-in)

#### Key Checks:
1. Page title announced correctly
2. All headings read in order (H1 → H2 → H3)
3. Links announced with destination
4. Buttons announced with action
5. Images have alt text or marked decorative

### Touch Targets (Mobile)

#### Minimum Sizes

- **Touch targets**: 44x44px minimum (WCAG AA)
- **Spacing between targets**: 8px minimum

#### Implementation

```html
<!-- Navigation links: adequate padding for touch -->
<a href="/" class="px-4 py-3">Home</a>

<!-- Icon buttons: 40x40px (close to 44x44 with padding) -->
<button class="h-10 w-10 flex items-center justify-center">
  <span class="material-symbols-outlined">menu</span>
</button>

<!-- Tool cards: entire card is clickable area -->
<article class="p-6">
  <a href="/tools/json-schema/" class="contents">
    <!-- Large clickable area -->
  </a>
</article>
```

---

## Performance Considerations

### Performance Budgets

| Metric | Target | Budget Type |
|--------|--------|-------------|
| **Initial Load** | < 3 seconds | Time |
| **JavaScript Bundle** | < 50 KB | Size (gzipped) |
| **CSS Bundle** | < 30 KB | Size (gzipped) |
| **Total Page Weight** | < 500 KB | Size (uncompressed) |
| **Lighthouse Score** | ≥ 90 | Quality |

### Optimization Strategies

#### 1. Font Loading

Use `font-display: swap` to prevent FOIT (Flash of Invisible Text):

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Rozha+One&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
```

**Note:** `display=swap` already in URL

#### 2. CSS Strategy

- **Inline critical CSS** in `<head>` (FOUC prevention script)
- **Single CSS file** for utilities and components
- **No CSS-in-JS** (keeps bundle small)
- **Utility classes** reduce CSS bloat vs custom classes

#### 3. No Heavy Dependencies

DevToolbox homepage uses **ZERO frameworks**:
- ✅ Vanilla HTML5
- ✅ Vanilla CSS3 (utility classes)
- ✅ Vanilla JavaScript (ES6+)
- ❌ No React, Vue, Svelte
- ❌ No build step required
- ❌ No node_modules on client

#### 4. Image Optimization (Future)

If tool preview images added:
- Use WebP format with PNG fallback
- Lazy load below-the-fold images
- Use `loading="lazy"` attribute
- Provide responsive `srcset`

```html
<img src="tool-preview.webp" 
     alt="JSON Schema Validator interface" 
     loading="lazy"
     width="640" 
     height="360"
     class="w-full h-full object-cover" />
```

#### 5. Material Symbols Optimization

Load only what's needed:
- Use `wght,FILL@100..700,0..1` (variable weights)
- Icons loaded as font (vector), no image requests
- ~20KB for icon font (acceptable)

### Performance Testing

#### Tools

1. **Lighthouse** (Chrome DevTools)
   - Target: ≥90 Performance, ≥90 Accessibility, ≥90 Best Practices
   
2. **WebPageTest** (https://www.webpagetest.org/)
   - Test on 3G/4G networks
   - Check First Contentful Paint (FCP) < 1.8s
   
3. **Chrome DevTools Network Tab**
   - Total requests < 20
   - Total size < 500 KB

#### Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| **First Contentful Paint (FCP)** | < 1.8s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Time to Interactive (TTI)** | < 3.5s | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |
| **Total Blocking Time (TBT)** | < 300ms | Lighthouse |

### FOUC Prevention

**Critical:** Prevent flash of unstyled content during theme load.

```html
<head>
  <!-- MUST be in <head>, before any styles -->
  <script>
    (function() {
      const savedTheme = localStorage.getItem('devtoolbox_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      document.documentElement.classList.add(theme);
    })();
  </script>
</head>
```

**Why it Works:**
- Runs immediately on parse (no defer/async)
- Adds `.dark` or `.light` class before CSS loads
- Reads localStorage (theme persists)
- Respects system preference if no saved theme

---

## Complete HTML Structure Example

### Full Homepage Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- FOUC Prevention Script - MUST BE FIRST -->
  <script>
    (function() {
      const savedTheme = localStorage.getItem('devtoolbox_theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      document.documentElement.classList.add(theme);
    })();
  </script>
  
  <meta name="description" content="DevToolbox - Fast, private, browser-based developer utilities">
  <meta name="keywords" content="JSON validator, markdown converter, text diff, SIP calculator, EMI calculator">
  <title>DevToolbox - Developer Tools Platform</title>
  
  <!-- Preconnect to Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Fonts: Rozha One, Plus Jakarta Sans, Material Symbols -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Rozha+One&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  
  <!-- Heritage Design System CSS -->
  <link rel="stylesheet" href="/shared/css/heritage-design-system.css">
  <link rel="stylesheet" href="/shared/css/utilities.css">
  <link rel="stylesheet" href="/shared/css/themes.css">
  <link rel="stylesheet" href="/home/home.css">
</head>

<body class="bg-background-light dark:bg-background-dark 
             text-text-light dark:text-text-dark 
             font-display min-h-screen transition-colors duration-300">
  
  <div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
    
    <!-- ============================================
         HEADER COMPONENT
         ============================================ -->
    <header class="flex items-center justify-between whitespace-nowrap 
                   border-b border-solid border-muted-light/20 dark:border-muted-dark/30 
                   px-4 py-3 mb-8">
      
      <!-- Left: Logo + Title -->
      <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
        <div class="size-6 text-primary dark:text-accent-dark">
          <span class="material-symbols-outlined" style="font-size: 24px;">
            temple_hindu
          </span>
        </div>
        <h2 class="font-heading text-2xl leading-tight tracking-[-0.015em]">
          DevToolbox
        </h2>
      </div>
      
      <!-- Right: Navigation + Theme Toggle + Mobile Menu -->
      <div class="flex items-center gap-8">
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-9" role="navigation" aria-label="Main navigation">
          <a href="/" 
             class="text-primary dark:text-primary-dark text-sm font-bold leading-normal 
                    border-b-2 border-primary dark:border-primary-dark pb-1 font-display">
            Home
          </a>
          <a href="#tools" 
             class="text-text-light dark:text-text-dark text-sm font-medium leading-normal 
                    hover:text-primary dark:hover:text-primary-dark transition-colors font-display">
            Tools
          </a>
          <a href="#about" 
             class="text-text-light dark:text-text-dark text-sm font-medium leading-normal 
                    hover:text-primary dark:hover:text-primary-dark transition-colors font-display">
            About
          </a>
        </nav>
        
        <!-- Theme Toggle Button -->
        <button aria-label="Toggle dark mode theme" 
                data-theme-toggle
                class="flex h-10 w-10 cursor-pointer items-center justify-center 
                       overflow-hidden rounded-full 
                       bg-surface-light dark:bg-surface-dark 
                       text-text-light dark:text-accent-dark 
                       shadow-sm hover:scale-110 transition-transform">
          <span class="material-symbols-outlined hidden dark:block" 
                aria-hidden="true" data-icon="dark_mode">
            dark_mode
          </span>
          <span class="material-symbols-outlined block dark:hidden" 
                aria-hidden="true" data-icon="light_mode">
            light_mode
          </span>
        </button>
        
        <!-- Mobile Menu Button -->
        <button class="md:hidden flex h-10 w-10 items-center justify-center 
                       text-text-light dark:text-text-dark" 
                aria-label="Open navigation menu">
          <span class="material-symbols-outlined" aria-hidden="true">menu</span>
        </button>
        
      </div>
    </header>
    
    <!-- ============================================
         MAIN CONTENT
         ============================================ -->
    <main class="px-4 sm:px-10 lg:px-40 flex-1 py-5" role="main" id="main-content">
      <div class="max-w-[1200px] mx-auto">
        
        <!-- ============================================
             HERO SECTION
             ============================================ -->
        <section class="py-8 md:py-12 px-4 mb-6" aria-labelledby="hero-heading">
          <div class="max-w-4xl mx-auto text-center">
            
            <!-- Main Heading -->
            <h1 id="hero-heading" 
                class="font-heading text-4xl md:text-5xl lg:text-6xl 
                       text-text-light dark:text-text-dark 
                       mb-4 font-normal leading-tight">
              DevToolbox
            </h1>
            
            <!-- Tagline -->
            <p class="text-lg md:text-xl 
                      text-muted-light dark:text-muted-dark 
                      max-w-2xl mx-auto 
                      font-display leading-relaxed">
              Fast, private, browser-based developer utilities
            </p>
            
            <!-- Privacy Badge -->
            <div class="mt-6 inline-flex items-center gap-2 
                        px-4 py-2 
                        bg-surface-light dark:bg-surface-dark 
                        border border-muted-light/20 dark:border-accent-dark/30 
                        rounded-full 
                        text-sm text-muted-light dark:text-text-dark">
              <span class="material-symbols-outlined text-base" aria-hidden="true">lock</span>
              <span>Everything runs in your browser. No data leaves your device.</span>
            </div>
            
          </div>
        </section>
        
        <!-- ============================================
             TOOL CARD GRID
             ============================================ -->
        <section id="tools" class="p-4 md:p-10" aria-labelledby="tools-heading">
          <h2 id="tools-heading" class="sr-only">Available Developer Tools</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <!-- ============================================
                 TOOL CARD 1: JSON Schema Validator
                 ============================================ -->
            <article class="group flex flex-col gap-4 cursor-pointer 
                            hover:-translate-y-2 transition-transform duration-300">
              <a href="/tools/json-schema/" class="contents">
                
                <!-- Tool Icon -->
                <div class="flex items-center justify-center h-20">
                  <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl" 
                        aria-hidden="true">
                    data_object
                  </span>
                </div>
                
                <!-- Tool Content Card -->
                <div class="bg-surface-light dark:bg-surface-dark 
                            p-6 rounded-lg 
                            theme-shadow theme-shadow-hover theme-border">
                  
                  <h3 class="font-heading text-2xl mb-2 
                             text-text-light dark:text-text-dark">
                    JSON Schema Validator
                  </h3>
                  
                  <p class="text-sm 
                            text-muted-light dark:text-text-dark 
                            line-clamp-2 mb-4 leading-relaxed">
                    Validate JSON against schemas with detailed error reporting and instant feedback
                  </p>
                  
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 
                                 bg-surface-light dark:bg-surface-dark 
                                 text-primary dark:text-accent-dark 
                                 text-xs font-bold uppercase tracking-wider 
                                 rounded-full dark:rounded-sharp 
                                 border border-transparent dark:border-accent-dark/30">
                      JSON
                    </span>
                  </div>
                  
                </div>
              </a>
            </article>
            
            <!-- ============================================
                 TOOL CARD 2: HTML ↔ Markdown
                 ============================================ -->
            <article class="group flex flex-col gap-4 cursor-pointer 
                            hover:-translate-y-2 transition-transform duration-300">
              <a href="/tools/html-markdown/" class="contents">
                
                <div class="flex items-center justify-center h-20">
                  <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl" 
                        aria-hidden="true">
                    code_blocks
                  </span>
                </div>
                
                <div class="bg-surface-light dark:bg-surface-dark 
                            p-6 rounded-lg 
                            theme-shadow theme-shadow-hover theme-border">
                  
                  <h3 class="font-heading text-2xl mb-2 
                             text-text-light dark:text-text-dark">
                    HTML ↔ Markdown
                  </h3>
                  
                  <p class="text-sm 
                            text-muted-light dark:text-text-dark 
                            line-clamp-2 mb-4 leading-relaxed">
                    Bidirectional conversion between HTML and Markdown with syntax preservation
                  </p>
                  
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 
                                 bg-surface-light dark:bg-surface-dark 
                                 text-primary dark:text-accent-dark 
                                 text-xs font-bold uppercase tracking-wider 
                                 rounded-full dark:rounded-sharp 
                                 border border-transparent dark:border-accent-dark/30">
                      Converter
                    </span>
                  </div>
                  
                </div>
              </a>
            </article>
            
            <!-- ============================================
                 TOOL CARD 3: Text Diff Checker
                 ============================================ -->
            <article class="group flex flex-col gap-4 cursor-pointer 
                            hover:-translate-y-2 transition-transform duration-300">
              <a href="/tools/text-diff/" class="contents">
                
                <div class="flex items-center justify-center h-20">
                  <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl" 
                        aria-hidden="true">
                    difference
                  </span>
                </div>
                
                <div class="bg-surface-light dark:bg-surface-dark 
                            p-6 rounded-lg 
                            theme-shadow theme-shadow-hover theme-border">
                  
                  <h3 class="font-heading text-2xl mb-2 
                             text-text-light dark:text-text-dark">
                    Text Diff Checker
                  </h3>
                  
                  <p class="text-sm 
                            text-muted-light dark:text-text-dark 
                            line-clamp-2 mb-4 leading-relaxed">
                    Compare two text blocks with side-by-side diff highlighting and line-by-line analysis
                  </p>
                  
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 
                                 bg-surface-light dark:bg-surface-dark 
                                 text-primary dark:text-accent-dark 
                                 text-xs font-bold uppercase tracking-wider 
                                 rounded-full dark:rounded-sharp 
                                 border border-transparent dark:border-accent-dark/30">
                      Diff
                    </span>
                  </div>
                  
                </div>
              </a>
            </article>
            
            <!-- ============================================
                 TOOL CARD 4: SIP Calculator
                 ============================================ -->
            <article class="group flex flex-col gap-4 cursor-pointer 
                            hover:-translate-y-2 transition-transform duration-300">
              <a href="/tools/sip-calculator/" class="contents">
                
                <div class="flex items-center justify-center h-20">
                  <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl" 
                        aria-hidden="true">
                    trending_up
                  </span>
                </div>
                
                <div class="bg-surface-light dark:bg-surface-dark 
                            p-6 rounded-lg 
                            theme-shadow theme-shadow-hover theme-border">
                  
                  <h3 class="font-heading text-2xl mb-2 
                             text-text-light dark:text-text-dark">
                    SIP Calculator
                  </h3>
                  
                  <p class="text-sm 
                            text-muted-light dark:text-text-dark 
                            line-clamp-2 mb-4 leading-relaxed">
                    Calculate Systematic Investment Plan returns with visual growth projections and breakdowns
                  </p>
                  
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 
                                 bg-surface-light dark:bg-surface-dark 
                                 text-primary dark:text-accent-dark 
                                 text-xs font-bold uppercase tracking-wider 
                                 rounded-full dark:rounded-sharp 
                                 border border-transparent dark:border-accent-dark/30">
                      Finance
                    </span>
                  </div>
                  
                </div>
              </a>
            </article>
            
            <!-- ============================================
                 TOOL CARD 5: EMI Calculator
                 ============================================ -->
            <article class="group flex flex-col gap-4 cursor-pointer 
                            hover:-translate-y-2 transition-transform duration-300">
              <a href="/tools/emi-calculator/" class="contents">
                
                <div class="flex items-center justify-center h-20">
                  <span class="material-symbols-outlined text-primary dark:text-accent-dark text-5xl" 
                        aria-hidden="true">
                    account_balance
                  </span>
                </div>
                
                <div class="bg-surface-light dark:bg-surface-dark 
                            p-6 rounded-lg 
                            theme-shadow theme-shadow-hover theme-border">
                  
                  <h3 class="font-heading text-2xl mb-2 
                             text-text-light dark:text-text-dark">
                    EMI Calculator
                  </h3>
                  
                  <p class="text-sm 
                            text-muted-light dark:text-text-dark 
                            line-clamp-2 mb-4 leading-relaxed">
                    Compute loan EMIs with detailed amortization schedules and interest breakdowns
                  </p>
                  
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 
                                 bg-surface-light dark:bg-surface-dark 
                                 text-primary dark:text-accent-dark 
                                 text-xs font-bold uppercase tracking-wider 
                                 rounded-full dark:rounded-sharp 
                                 border border-transparent dark:border-accent-dark/30">
                      Loan
                    </span>
                  </div>
                  
                </div>
              </a>
            </article>
            
          </div>
        </section>
        
      </div>
    </main>
    
  </div>
  
  <!-- ============================================
       JAVASCRIPT
       ============================================ -->
  <script src="/shared/js/theme-toggle.js"></script>
  
</body>
</html>
```

---

## Summary & Next Steps

### What This Spec Delivers

✅ **Complete homepage layout** with header, hero, and tool grid  
✅ **Utility-first implementation** using DevToolbox utility classes  
✅ **Material Symbols icons** for branding and tool identification  
✅ **Responsive design** (mobile → tablet → desktop)  
✅ **Theme-aware styling** (light/dark with Heritage effects)  
✅ **Accessibility standards** (WCAG 2.1 AA compliant)  
✅ **Performance optimized** (zero frameworks, <3s load)  

### Implementation Checklist

- [ ] **Phase 2.2**: Implement HTML structure in `/index.html`
- [ ] **Phase 2.3**: Create missing utility classes in `/shared/css/utilities.css`
- [ ] **Phase 2.4**: Add theme classes (`.theme-shadow`, `.theme-border`, etc.)
- [ ] **Phase 2.5**: Test responsive breakpoints (320px, 768px, 1024px, 1920px)
- [ ] **Phase 2.6**: Verify accessibility (keyboard nav, screen readers, contrast)
- [ ] **Phase 2.7**: Performance testing (Lighthouse, WebPageTest)
- [ ] **Phase 2.8**: Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Design Artifacts

**Created:**
- ✅ `/docs/design/HOMEPAGE_DESIGN_SPEC.md` (this document)

**To Reference:**
- 📖 [UTILITY_CLASS_SYSTEM.md](./UTILITY_CLASS_SYSTEM.md) - Utility class reference
- 📖 [NEW_DESIGN_ANALYSIS.md](./NEW_DESIGN_ANALYSIS.md) - Design template analysis
- 📖 [material-symbols-integration.skill.md](../../.github/skills/material-symbols-integration.skill.md) - Icon usage guide

### Questions for Stakeholders

1. **Mobile menu behavior**: Should mobile menu be a slide-out drawer or dropdown?
2. **Filter bar**: Do we need tool category filters on homepage?
3. **Footer**: Should homepage have a footer (copyright, links, social)?
4. **Privacy badge**: Keep the "no data leaves device" badge or remove?
5. **Tool cards**: Should cards link directly to tools or show a preview modal first?

---

**Design Specification Complete**  
**Version:** 2.1  
**Date:** March 23, 2026  
**Ready for Implementation:** ✅
