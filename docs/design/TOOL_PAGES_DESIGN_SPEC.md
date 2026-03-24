# DevToolbox Tool Pages Design Specification

**Version:** 3.0  
**Date:** March 23, 2026  
**Status:** Phase 3 - Design Complete  
**Phase:** Tool Pages Redesign  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Universal Tool Page Template](#universal-tool-page-template)
3. [Layout Architecture](#layout-architecture)
4. [Shared Components Library](#shared-components-library)
5. [Tool-Specific Layout Patterns](#tool-specific-layout-patterns)
6. [Tool Page Designs (All 5 Tools)](#tool-page-designs-all-5-tools)
7. [Responsive Behavior](#responsive-behavior)
8. [Theme Integration](#theme-integration)
9. [Accessibility Requirements](#accessibility-requirements)
10. [Performance Considerations](#performance-considerations)
11. [Implementation Checklist](#implementation-checklist)
12. [Complete HTML Examples](#complete-html-examples)

---

## Overview

### Design Goals

The DevToolbox tool pages redesign aims to:

1. **Apply Heritage Evolution design system** consistently across all 5 tools
2. **Create standardized layouts** with flexible tool-specific customization
3. **Maintain 100% existing functionality** - all features preserved
4. **Deliver exceptional UX** with intuitive interactions and visual feedback
5. **Ensure accessibility** meeting WCAG 2.1 AA standards (targeting AAA)

### Design Principles Applied

- **Consistency First**: Universal template with shared header, breadcrumb, hero
- **Flexibility Second**: Tool-specific content areas adapt to unique requirements
- **Heritage Everything**: Utility classes, color palette, typography, shadows
- **Mobile-First**: Single column → two columns → optimized desktop layouts
- **Functional Preservation**: Every existing feature works as-is, just looks better

### Success Criteria

✅ Single universal template works for all 5 tools  
✅ Preserves all existing tool functionality (JSON validation, conversions, calculations)  
✅ Applies Heritage design system completely (dual themes, utility classes)  
✅ Maintains responsive behavior (mobile, tablet, desktop)  
✅ Meets WCAG 2.1 AA accessibility  
✅ Uses utility classes (minimal custom CSS)  
✅ Material Symbols icons throughout  

---

## Universal Tool Page Template

### Visual Hierarchy

```
┌────────────────────────────────────────────────────────────┐
│ SHARED HEADER (from homepage)                              │
│ ┌─────────────┐  ┌──────────────┐  ┌───────────────┐     │
│ │ Logo+Title  │  │ Navigation   │  │ Theme Toggle  │     │
│ └─────────────┘  └──────────────┘  └───────────────┘     │
├────────────────────────────────────────────────────────────┤
│ BREADCRUMB NAVIGATION                                      │
│ Home / Tool Name                                           │
├────────────────────────────────────────────────────────────┤
│ TOOL HERO SECTION                                          │
│          [Tool Icon]                                       │
│          Tool Name (H1)                                    │
│    Brief tool description                                  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ TOOL-SPECIFIC CONTENT AREA                                 │
│                                                            │
│ (Flexible layout based on tool type)                      │
│ - Text Input/Output Tools: Side-by-side or stacked        │
│ - Calculator Tools: Form → Results → Chart                │
│ - Comparison Tools: Three-pane layout                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### HTML Structure Template

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
  
  <meta name="description" content="[Tool description]">
  <title>[Tool Name] - DevToolbox</title>
  
  <!-- Preconnect to Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Fonts: Rozha One, Plus Jakarta Sans, Material Symbols -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Rozha+One&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  
  <!-- Heritage Design System CSS -->
  <link rel="stylesheet" href="/shared/css/reset.css">
  <link rel="stylesheet" href="/shared/css/variables.css">
  <link rel="stylesheet" href="/shared/css/themes.css">
  <link rel="stylesheet" href="/shared/css/utilities.css">
  <link rel="stylesheet" href="./[tool-name].css">
  
  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>">
</head>

<body class="bg-background-light dark:bg-background-dark 
             text-text-light dark:text-text-dark 
             font-display min-h-screen transition-colors duration-300">
  
  <!-- Shared Header Component -->
  <header class="flex items-center justify-between whitespace-nowrap 
                 border-b border-solid border-muted-light/20 dark:border-muted-dark/30 
                 px-4 py-3">
    <!-- Logo + Title (Left) -->
    <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
      <div class="size-6 text-primary dark:text-accent-dark flex items-center justify-center">
        <span class="material-symbols-outlined" style="font-size: 24px;">temple_hindu</span>
      </div>
      <h2 class="font-heading text-2xl leading-tight tracking-[-0.015em]">
        <a href="/" class="hover:text-primary dark:hover:text-primary-dark transition-colors">DevToolbox</a>
      </h2>
    </div>
    
    <!-- Navigation + Theme Toggle (Right) -->
    <div class="flex items-center gap-8">
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-9" aria-label="Primary navigation">
        <a href="/" 
           class="text-text-light dark:text-text-dark 
                  text-sm font-medium leading-normal 
                  hover:text-primary dark:hover:text-primary-dark 
                  transition-colors font-display">
          Home
        </a>
        <a href="/#tools" 
           class="text-text-light dark:text-text-dark 
                  text-sm font-medium leading-normal 
                  hover:text-primary dark:hover:text-primary-dark 
                  transition-colors font-display">
          Tools
        </a>
        <a href="/#about" 
           class="text-text-light dark:text-text-dark 
                  text-sm font-medium leading-normal 
                  hover:text-primary dark:hover:text-primary-dark 
                  transition-colors font-display">
          About
        </a>
      </nav>
      
      <!-- Theme Toggle -->
      <button aria-label="Toggle Theme" 
              data-theme-toggle
              class="flex h-10 w-10 cursor-pointer items-center justify-center 
                     overflow-hidden rounded-full 
                     bg-surface-light dark:bg-surface-dark 
                     text-text-light dark:text-accent-dark 
                     hover:scale-110 transition-transform">
        <span class="material-symbols-outlined text-current theme-icon-light block dark:hidden">
          light_mode
        </span>
        <span class="material-symbols-outlined text-current theme-icon-dark hidden dark:block">
          dark_mode
        </span>
      </button>
      
      <!-- Mobile Hamburger Menu (optional future implementation) -->
      <button aria-label="Menu" 
              class="flex md:hidden h-10 w-10 cursor-pointer items-center justify-center 
                     bg-surface-light dark:bg-surface-dark rounded-full">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </header>
  
  <!-- Main Content Container -->
  <main class="px-4 sm:px-10 lg:px-20 py-5">
    <div class="max-w-[1440px] mx-auto">
      
      <!-- Breadcrumb Navigation -->
      <nav aria-label="Breadcrumb" class="mb-6">
        <ol class="flex items-center gap-2 text-sm text-muted-light dark:text-muted-dark">
          <li>
            <a href="/" class="hover:text-primary dark:hover:text-primary-dark transition-colors">
              Home
            </a>
          </li>
          <li>
            <span class="material-symbols-outlined text-xs">chevron_right</span>
          </li>
          <li class="text-text-light dark:text-text-dark font-medium" aria-current="page">
            [Tool Name]
          </li>
        </ol>
      </nav>
      
      <!-- Tool Hero Section -->
      <section class="text-center py-8 md:py-12 mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="size-16 md:size-20 
                      text-primary dark:text-accent-dark 
                      flex items-center justify-center
                      bg-surface-light dark:bg-surface-dark
                      rounded-full
                      theme-shadow">
            <span class="material-symbols-outlined" style="font-size: 40px;">
              [tool_icon]
            </span>
          </div>
        </div>
        <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl 
                   text-text-light dark:text-text-dark 
                   mb-4 tracking-tight">
          [Tool Name]
        </h1>
        <p class="text-lg md:text-xl text-muted-light dark:text-muted-dark max-w-2xl mx-auto">
          [Tool description]
        </p>
      </section>
      
      <!-- Tool-Specific Content Area -->
      <section class="tool-content-area">
        <!-- This section varies based on tool type -->
        <!-- See tool-specific designs below -->
      </section>
      
    </div>
  </main>
  
  <!-- Theme Toggle Script -->
  <script type="module">
    const themeToggle = document.querySelector('[data-theme-toggle]');
    
    themeToggle?.addEventListener('click', () => {
      const html = document.documentElement;
      const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.classList.remove(currentTheme);
      html.classList.add(newTheme);
      localStorage.setItem('devtoolbox_theme', newTheme);
    });
  </script>
  
  <!-- Tool-Specific JavaScript -->
  <script type="module" src="./[tool-name].js"></script>
  
</body>
</html>
```

---

## Layout Architecture

### Three-Tier Responsive System

**Mobile First (<768px):**
- Single column stacked layout
- Full-width input/output areas
- Actions below each section
- 16px horizontal padding
- Simplified charts (if applicable)

**Tablet (768px - 1023px):**
- Two-column grid where appropriate
- Side-by-side layouts start appearing
- 40px horizontal padding
- Optimized for portrait tablets

**Desktop (≥1024px):**
- Multi-column optimized layouts
- Maximum content width 1440px
- 80px horizontal padding
- Full chart visualizations
- Hover effects active

### Container Strategy

```html
<!-- Main content uses max-width constraint -->
<main class="px-4 sm:px-10 lg:px-20 py-5">
  <div class="max-w-[1440px] mx-auto">
    <!-- Content constrained to 1440px max, centered -->
  </div>
</main>
```

---

## Shared Components Library

### Component 1: Tool Header (in Universal Template)

Already defined in universal template above. Reuses homepage header exactly.

---

### Component 2: Breadcrumb Navigation

**Purpose:** Provide navigation context, help users understand location.

**HTML:**
```html
<nav aria-label="Breadcrumb" class="mb-6">
  <ol class="flex items-center gap-2 text-sm text-muted-light dark:text-muted-dark">
    <li>
      <a href="/" class="hover:text-primary dark:hover:text-primary-dark transition-colors">
        Home
      </a>
    </li>
    <li>
      <span class="material-symbols-outlined text-xs">chevron_right</span>
    </li>
    <li class="text-text-light dark:text-text-dark font-medium" aria-current="page">
      [Tool Name]
    </li>
  </ol>
</nav>
```

**Utility Classes Used:**
- `flex items-center gap-2` - Horizontal layout with spacing
- `text-sm` - Small text size
- `text-muted-light dark:text-muted-dark` - Muted colors (theme aware)
- `hover:text-primary dark:hover:text-primary-dark` - Hover state colors
- `transition-colors` - Smooth color transitions

---

### Component 3: Tool Hero Section

**Purpose:** Display tool icon, name, and description prominently.

**HTML:**
```html
<section class="text-center py-8 md:py-12 mb-8">
  <!-- Icon Container -->
  <div class="flex items-center justify-center mb-4">
    <div class="size-16 md:size-20 
                text-primary dark:text-accent-dark 
                flex items-center justify-center
                bg-surface-light dark:bg-surface-dark
                rounded-full
                theme-shadow">
      <span class="material-symbols-outlined" style="font-size: 40px;">
        data_object
      </span>
    </div>
  </div>
  
  <!-- Tool Title -->
  <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl 
             text-text-light dark:text-text-dark 
             mb-4 tracking-tight">
    JSON Schema Validator
  </h1>
  
  <!-- Tool Description -->
  <p class="text-lg md:text-xl text-muted-light dark:text-muted-dark max-w-2xl mx-auto">
    Validate, minify, and beautify JSON data with real-time error detection
  </p>
</section>
```

**Key Features:**
- Responsive icon size: `size-16 md:size-20` (64px → 80px on tablet+)
- Responsive typography: `text-4xl md:text-5xl lg:text-6xl`
- Heritage shadow effect: `theme-shadow` (soft in light, glow in dark)
- Circular icon container with surface background
- Theme-aware colors throughout

---

### Component 4: Input Field (Textarea)

**Purpose:** Text input areas for JSON, HTML, Markdown, or plain text.

**HTML:**
```html
<div class="input-container">
  <!-- Section Header -->
  <div class="flex items-center justify-between mb-3">
    <h3 class="font-heading text-xl text-text-light dark:text-text-dark">
      Input
    </h3>
    <div class="flex items-center gap-2">
      <button class="btn-icon" aria-label="Clear input">
        <span class="material-symbols-outlined">delete</span>
      </button>
      <button class="btn-icon" aria-label="Paste from clipboard">
        <span class="material-symbols-outlined">content_paste</span>
      </button>
    </div>
  </div>
  
  <!-- Textarea -->
  <textarea 
    class="w-full h-64 md:h-96 
           p-4 
           bg-surface-light dark:bg-surface-dark 
           text-text-light dark:text-text-dark 
           border border-muted-light/30 dark:border-accent-dark/30 
           rounded-lg 
           focus:outline-none focus:ring-2 
           focus:ring-primary dark:focus:ring-primary-dark 
           font-mono text-sm 
           resize-y
           transition-all"
    placeholder="Enter your input here..."
    spellcheck="false"
    aria-label="Input text editor"
  ></textarea>
  
  <!-- Character Count -->
  <div class="flex items-center justify-between mt-2 text-xs text-muted-light dark:text-muted-dark">
    <span id="char-count">0 characters</span>
    <span id="line-count">0 lines</span>
  </div>
</div>
```

**Utility Classes Breakdown:**
- `w-full` - Full width of container
- `h-64 md:h-96` - Height 256px mobile, 384px tablet+
- `p-4` - 16px padding
- `bg-surface-light dark:bg-surface-dark` - Surface background (theme aware)
- `text-text-light dark:text-text-dark` - Text color (theme aware)
- `border border-muted-light/30 dark:border-accent-dark/30` - Border color with opacity
- `rounded-lg` - 8px border radius
- `focus:outline-none focus:ring-2 focus:ring-primary` - Focus state (ring)
- `font-mono text-sm` - Monospace font, small size
- `resize-y` - Vertical resize only
- `transition-all` - Smooth transitions

---

### Component 5: Primary Action Button

**Purpose:** Main call-to-action buttons (Validate, Calculate, Convert).

**HTML:**
```html
<button class="btn-primary">
  <span class="material-symbols-outlined mr-2">check_circle</span>
  Validate JSON
</button>

<!-- OR with utility classes only: -->
<button class="px-6 py-3 
               bg-primary dark:bg-primary-dark 
               text-white 
               font-semibold text-base 
               rounded-lg 
               hover:scale-105 
               active:scale-95 
               transition-transform 
               focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark 
               flex items-center justify-center gap-2">
  <span class="material-symbols-outlined">check_circle</span>
  <span>Validate JSON</span>
</button>
```

**States:**
- Default: Primary color background, white text
- Hover: Scale 1.05 (lift effect)
- Active: Scale 0.95 (press effect)
- Focus: 2px ring in primary color
- Disabled: Reduced opacity, no pointer events

**CSS for .btn-primary class (if needed):**
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  padding: 0.75rem 1.5rem;
  
  background-color: var(--color-primary);
  color: #FFFFFF;
  
  font-weight: 600;
  font-size: 1rem;
  
  border: none;
  border-radius: 0.5rem;
  
  cursor: pointer;
  
  transition: transform 0.2s ease;
}

.btn-primary:hover {
  transform: scale(1.05);
}

.btn-primary:active {
  transform: scale(0.95);
}

.btn-primary:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark .btn-primary {
  background-color: var(--color-primary-dark);
}
```

---

### Component 6: Secondary Action Button

**Purpose:** Less prominent actions (Clear, Reset, Sample).

**HTML:**
```html
<button class="px-4 py-2 
               bg-transparent 
               text-primary dark:text-primary-dark 
               font-medium text-sm 
               border border-primary/30 dark:border-primary-dark/30 
               rounded-lg 
               hover:bg-primary/10 dark:hover:bg-primary-dark/10 
               transition-all 
               flex items-center justify-center gap-2">
  <span class="material-symbols-outlined text-lg">refresh</span>
  <span>Reset</span>
</button>
```

---

### Component 7: Icon Button (Small Actions)

**Purpose:** Compact buttons for utility actions (Copy, Download, Delete).

**HTML:**
```html
<button class="btn-icon" aria-label="Copy to clipboard">
  <span class="material-symbols-outlined">content_copy</span>
</button>

<!-- OR with utility classes: -->
<button class="flex h-8 w-8 
               items-center justify-center 
               rounded-lg 
               bg-transparent 
               text-muted-light dark:text-muted-dark 
               hover:bg-surface-light dark:hover:bg-surface-dark 
               hover:text-primary dark:hover:text-primary-dark 
               transition-all 
               cursor-pointer"
        aria-label="Copy to clipboard">
  <span class="material-symbols-outlined text-xl">content_copy</span>
</button>
```

---

### Component 8: Results Card

**Purpose:** Display calculation results, statistics, or output summaries.

**HTML:**
```html
<div class="p-6 
            bg-surface-light dark:bg-surface-dark 
            border border-muted-light/20 dark:border-accent-dark/20 
            rounded-lg 
            theme-shadow">
  
  <!-- Card Header -->
  <h3 class="font-heading text-xl text-text-light dark:text-text-dark mb-4">
    Calculation Results
  </h3>
  
  <!-- Card Content -->
  <div class="space-y-4">
    <!-- Result Item -->
    <div class="flex items-center justify-between">
      <span class="text-muted-light dark:text-muted-dark">Monthly EMI:</span>
      <span class="font-semibold text-lg text-primary dark:text-primary-dark">₹21,213</span>
    </div>
    
    <!-- Result Item -->
    <div class="flex items-center justify-between">
      <span class="text-muted-light dark:text-muted-dark">Total Interest:</span>
      <span class="font-semibold text-lg text-text-light dark:text-text-dark">₹25,91,120</span>
    </div>
  </div>
</div>
```

**Key Features:**
- `theme-shadow` - Heritage shadow effect (soft/glow based on theme)
- `space-y-4` - Vertical spacing between items
- Semantic color usage (primary for emphasis, muted for labels)

---

### Component 9: Form Input Field

**Purpose:** Form inputs for calculators (number inputs, selects).

**HTML:**
```html
<div class="form-group mb-5">
  <!-- Label -->
  <label for="loan-amount" 
         class="block mb-2 
                text-sm font-medium 
                text-text-light dark:text-text-dark">
    Loan Amount (₹)
    <span class="text-red-500">*</span>
  </label>
  
  <!-- Input -->
  <input type="number" 
         id="loan-amount"
         class="w-full 
                px-4 py-3 
                bg-surface-light dark:bg-surface-dark 
                text-text-light dark:text-text-dark 
                border border-muted-light/30 dark:border-accent-dark/30 
                rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark 
                transition-all"
         placeholder="2500000"
         min="100000"
         max="100000000"
         step="100000"
         required
         aria-describedby="loan-amount-help" />
  
  <!-- Help Text -->
  <small id="loan-amount-help" 
         class="block mt-1 text-xs text-muted-light dark:text-muted-dark">
    Minimum: ₹1,00,000 | Maximum: ₹10,00,00,000
  </small>
</div>
```

---

### Component 10: Status Message

**Purpose:** Display success, error, warning, or info messages.

**HTML:**
```html
<!-- Success Message -->
<div class="flex items-start gap-3 
            p-4 
            bg-green-100 dark:bg-green-900/20 
            border-l-4 border-green-500 
            rounded-r-lg" 
     role="status" 
     aria-live="polite">
  <span class="material-symbols-outlined text-green-600 dark:text-green-400">
    check_circle
  </span>
  <div>
    <p class="font-semibold text-green-800 dark:text-green-200">Success!</p>
    <p class="text-sm text-green-700 dark:text-green-300">JSON is valid</p>
  </div>
</div>

<!-- Error Message -->
<div class="flex items-start gap-3 
            p-4 
            bg-red-100 dark:bg-red-900/20 
            border-l-4 border-red-500 
            rounded-r-lg" 
     role="alert" 
     aria-live="assertive">
  <span class="material-symbols-outlined text-red-600 dark:text-red-400">
    error
  </span>
  <div>
    <p class="font-semibold text-red-800 dark:text-red-200">Error!</p>
    <p class="text-sm text-red-700 dark:text-red-300">Invalid JSON syntax at line 5</p>
  </div>
</div>

<!-- Warning Message -->
<div class="flex items-start gap-3 
            p-4 
            bg-yellow-100 dark:bg-yellow-900/20 
            border-l-4 border-yellow-500 
            rounded-r-lg" 
     role="status" 
     aria-live="polite">
  <span class="material-symbols-outlined text-yellow-600 dark:text-yellow-400">
    warning
  </span>
  <div>
    <p class="font-semibold text-yellow-800 dark:text-yellow-200">Warning</p>
    <p class="text-sm text-yellow-700 dark:text-yellow-300">Large file - processing may take time</p>
  </div>
</div>

<!-- Info Message -->
<div class="flex items-start gap-3 
            p-4 
            bg-blue-100 dark:bg-blue-900/20 
            border-l-4 border-blue-500 
            rounded-r-lg" 
     role="status" 
     aria-live="polite">
  <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">
    info
  </span>
  <div>
    <p class="font-semibold text-blue-800 dark:text-blue-200">Info</p>
    <p class="text-sm text-blue-700 dark:text-blue-300">All data processed locally - nothing sent to server</p>
  </div>
</div>
```

---

## Tool-Specific Layout Patterns

### Pattern A: Split Text Editor Tools
**Used by:** JSON Schema, HTML/Markdown

**Layout:** Side-by-side on desktop, stacked on mobile.

**Structure:**
```
┌─────────────────────┬─────────────────────┐
│ Input Section       │ Output Section      │
│ - Header + Actions  │ - Header + Actions  │
│ - Textarea          │ - Textarea          │
│ - Stats             │ - Stats             │
│                     │                     │
│                     │                     │
└─────────────────────┴─────────────────────┘
          ↑ Actions Bar (Middle) ↑
```

**Responsive:**
- Mobile: Stacked (Input → Actions → Output)
- Tablet+: Side-by-side with middle action bar
- Desktop: Wider side-by-side

---

### Pattern B: Comparison Tool (Three-Pane)
**Used by:** Text Diff

**Layout:** Three columns on desktop, stacked on mobile.

**Structure:**
```
┌──────────┬──────────┬──────────┐
│ Original │ Diff View│ Modified │
│ Text     │ (Middle) │ Text     │
│          │          │          │
│          │          │          │
└──────────┴──────────┴──────────┘
     ↑ Controls (Top Bar) ↑
```

**Responsive:**
- Mobile: Stacked (Controls → Original → Modified → Diff Results below)
- Tablet: Two-up (Original | Modified, diff below)
- Desktop: Three-pane side-by-side

---

### Pattern C: Calculator Form → Results
**Used by:** SIP Calculator, EMI Calculator

**Layout:** Form top, results below.

**Structure:**
```
┌─────────────────────────────────────┐
│ Input Form                          │
│ - Field 1                           │
│ - Field 2                           │
│ - Field 3                           │
│ - [Calculate Button]                │
├─────────────────────────────────────┤
│ Results Section                     │
│ - Summary Cards (Grid)              │
│ - Chart Visualization               │
│ - Detailed Breakdown Table          │
└─────────────────────────────────────┘
```

**Responsive:**
- Mobile: Single column, stacked cards
- Tablet: 2-column results grid
- Desktop: 3-column results grid, full-width chart

---

## Tool Page Designs (All 5 Tools)

### 1. JSON Schema Validator

**Icon:** `data_object`  
**Description:** "Validate, minify, and beautify JSON data with real-time error detection"  
**Layout Pattern:** Split Text Editor (Pattern A)

**Tool-Specific Content Area:**

```html
<section class="tool-content-area">
  
  <!-- Action Bar (Top) -->
  <div class="flex flex-wrap items-center justify-center gap-4 mb-6">
    <button class="btn-primary">
      <span class="material-symbols-outlined">check_circle</span>
      <span>Validate JSON</span>
    </button>
    <button class="btn-primary">
      <span class="material-symbols-outlined">schema</span>
      <span>Generate Schema</span>
    </button>
    <button class="px-4 py-2 bg-transparent border border-primary/30 dark:border-primary-dark/30 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all">
      <span class="material-symbols-outlined mr-2">compress</span>
      <span>Minify</span>
    </button>
    <button class="px-4 py-2 bg-transparent border border-primary/30 dark:border-primary-dark/30 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all">
      <span class="material-symbols-outlined mr-2">auto_awesome</span>
      <span>Beautify</span>
    </button>
  </div>
  
  <!-- Split Layout: Input | Output -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
    <!-- Input Section -->
    <div class="flex flex-col">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark">
          Input JSON
        </h3>
        <div class="flex items-center gap-2">
          <button class="btn-icon" aria-label="Clear input">
            <span class="material-symbols-outlined">delete</span>
          </button>
          <button class="btn-icon" aria-label="Paste from clipboard">
            <span class="material-symbols-outlined">content_paste</span>
          </button>
        </div>
      </div>
      
      <!-- Textarea -->
      <textarea 
        id="json-input"
        class="w-full h-64 md:h-96 lg:h-[500px]
               p-4 
               bg-surface-light dark:bg-surface-dark 
               text-text-light dark:text-text-dark 
               border border-muted-light/30 dark:border-accent-dark/30 
               rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark 
               font-mono text-sm 
               resize-none
               transition-all"
        placeholder='{"name": "John", "age": 30}'
        spellcheck="false"
        aria-label="JSON input editor"
      ></textarea>
      
      <!-- Stats -->
      <div class="flex items-center justify-between mt-2 text-xs text-muted-light dark:text-muted-dark">
        <span id="input-char-count">0 characters</span>
        <span id="input-line-count">0 lines</span>
      </div>
    </div>
    
    <!-- Output Section -->
    <div class="flex flex-col">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark">
          Output
        </h3>
        <div class="flex items-center gap-2">
          <button class="btn-icon" aria-label="Copy output to clipboard" disabled>
            <span class="material-symbols-outlined">content_copy</span>
          </button>
          <button class="btn-icon" aria-label="Download as JSON file" disabled>
            <span class="material-symbols-outlined">download</span>
          </button>
        </div>
      </div>
      
      <!-- Textarea -->
      <textarea 
        id="json-output"
        class="w-full h-64 md:h-96 lg:h-[500px]
               p-4 
               bg-surface-light dark:bg-surface-dark 
               text-text-light dark:text-text-dark 
               border border-muted-light/30 dark:border-accent-dark/30 
               rounded-lg 
               font-mono text-sm 
               resize-none"
        placeholder="Output will appear here..."
        readonly
        aria-label="JSON output display"
      ></textarea>
      
      <!-- Stats -->
      <div class="flex items-center justify-between mt-2 text-xs text-muted-light dark:text-muted-dark">
        <span id="output-char-count">0 characters</span>
        <span id="output-reduction"></span>
      </div>
    </div>
    
  </div>
  
  <!-- Status Message Area -->
  <div id="status-message" class="mt-6" role="status" aria-live="polite"></div>
  
  <!-- Indentation Controls -->
  <div class="flex items-center gap-3 mt-6">
    <label for="indent-select" class="text-sm font-medium text-text-light dark:text-text-dark">
      Indentation:
    </label>
    <select id="indent-select" 
            class="px-3 py-2 
                   bg-surface-light dark:bg-surface-dark 
                   text-text-light dark:text-text-dark 
                   border border-muted-light/30 dark:border-accent-dark/30 
                   rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark 
                   text-sm"
            aria-label="Indentation style">
      <option value="2">2 spaces</option>
      <option value="4">4 spaces</option>
      <option value="\t">Tab</option>
    </select>
  </div>
  
</section>
```

**Tool-Specific CSS (json-schema.css):**
```css
/* Minimal custom CSS - most styling via utilities */

.btn-icon {
  display: flex;
  align-items: center;
  justify-center: center;
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background-color: transparent;
  color: var(--color-muted-light);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover:not(:disabled) {
  background-color: var(--color-surface-light);
  color: var(--color-primary);
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dark .btn-icon {
  color: var(--color-muted-dark);
}

.dark .btn-icon:hover:not(:disabled) {
  background-color: var(--color-surface-dark);
  color: var(--color-primary-dark);
}

/* Preserve syntax highlighting if implemented */
.json-editor .json-key { color: var(--color-primary); }
.json-editor .json-string { color: #16a34a; }
.json-editor .json-number { color: #2563eb; }
.json-editor .json-boolean { color: #dc2626; }
```

---

### 2. HTML ↔ Markdown Converter

**Icon:** `code_blocks`  
**Description:** "Convert between HTML and Markdown formats with live preview"  
**Layout Pattern:** Split Text Editor with Controls (Pattern A variant)

**Tool-Specific Content Area:**

```html
<section class="tool-content-area">
  
  <!-- Conversion Controls (Center) -->
  <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
    
    <button id="html-to-md-btn" class="btn-primary w-full md:w-auto">
      <span>HTML</span>
      <span class="material-symbols-outlined">arrow_forward</span>
      <span>Markdown</span>
    </button>
    
    <button id="swap-btn" 
            class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark hover:scale-110 transition-transform"
            aria-label="Swap input and output">
      <span class="material-symbols-outlined">swap_horiz</span>
    </button>
    
    <button id="md-to-html-btn" class="btn-primary w-full md:w-auto">
      <span>Markdown</span>
      <span class="material-symbols-outlined">arrow_forward</span>
      <span>HTML</span>
    </button>
    
  </div>
  
  <!-- Options Panel -->
  <div class="mb-6 p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-muted-light/20 dark:border-accent-dark/20">
    <h3 class="font-heading text-lg text-text-light dark:text-text-dark mb-3">
      Conversion Options
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <label class="flex items-center gap-2 text-sm text-text-light dark:text-text-dark cursor-pointer">
        <input type="checkbox" id="gfm-enabled" checked 
               class="w-4 h-4 text-primary border-muted-light/30 dark:border-accent-dark/30 rounded focus:ring-primary dark:focus:ring-primary-dark">
        <span>GitHub Flavored Markdown (GFM)</span>
      </label>
      <label class="flex items-center gap-2 text-sm text-text-light dark:text-text-dark cursor-pointer">
        <input type="checkbox" id="sanitize-html" checked 
               class="w-4 h-4 text-primary border-muted-light/30 dark:border-accent-dark/30 rounded focus:ring-primary dark:focus:ring-primary-dark">
        <span>Sanitize HTML (Security)</span>
      </label>
      <label class="flex items-center gap-2 text-sm text-text-light dark:text-text-dark cursor-pointer">
        <input type="checkbox" id="preserve-whitespace" 
               class="w-4 h-4 text-primary border-muted-light/30 dark:border-accent-dark/30 rounded focus:ring-primary dark:focus:ring-primary-dark">
        <span>Preserve Whitespace</span>
      </label>
      <label class="flex items-center gap-2 text-sm text-text-light dark:text-text-dark cursor-pointer">
        <input type="checkbox" id="code-highlighting" checked 
               class="w-4 h-4 text-primary border-muted-light/30 dark:border-accent-dark/30 rounded focus:ring-primary dark:focus:ring-primary-dark">
        <span>Syntax Highlighting</span>
      </label>
    </div>
  </div>
  
  <!-- Split Layout: Input | Output -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
    <!-- Input Section -->
    <div class="flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark">Input</h3>
        <div class="flex items-center gap-2">
          <button class="btn-icon" aria-label="Clear input">
            <span class="material-symbols-outlined">delete</span>
          </button>
          <button class="btn-icon" aria-label="Paste from clipboard">
            <span class="material-symbols-outlined">content_paste</span>
          </button>
          <button class="btn-icon" aria-label="Load sample">
            <span class="material-symbols-outlined">description</span>
          </button>
        </div>
      </div>
      
      <textarea 
        id="input-editor"
        class="w-full h-64 md:h-96 lg:h-[500px]
               p-4 
               bg-surface-light dark:bg-surface-dark 
               text-text-light dark:text-text-dark 
               border border-muted-light/30 dark:border-accent-dark/30 
               rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark 
               font-mono text-sm 
               resize-none
               transition-all"
        placeholder="Enter HTML or Markdown here..."
        spellcheck="false"
        aria-label="Input editor"
      ></textarea>
      
      <div class="flex items-center justify-between mt-2 text-xs text-muted-light dark:text-muted-dark">
        <span id="input-char-count">0 characters</span>
        <span id="input-line-count">0 lines</span>
      </div>
    </div>
    
    <!-- Output Section -->
    <div class="flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark">Output</h3>
        <div class="flex items-center gap-2">
          <!-- View Mode Toggle -->
          <div class="flex items-center gap-1 p-1 bg-muted-light/20 dark:bg-muted-dark/20 rounded-lg">
            <button data-view="code" class="px-3 py-1 text-xs font-medium rounded bg-primary text-white">
              Code
            </button>
            <button data-view="preview" class="px-3 py-1 text-xs font-medium rounded text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark">
              Preview
            </button>
          </div>
          <button class="btn-icon" aria-label="Copy output">
            <span class="material-symbols-outlined">content_copy</span>
          </button>
        </div>
      </div>
      
      <!-- Code View -->
      <textarea 
        id="output-editor"
        class="w-full h-64 md:h-96 lg:h-[500px]
               p-4 
               bg-surface-light dark:bg-surface-dark 
               text-text-light dark:text-text-dark 
               border border-muted-light/30 dark:border-accent-dark/30 
               rounded-lg 
               font-mono text-sm 
               resize-none"
        placeholder="Output will appear here..."
        readonly
        aria-label="Output display"
      ></textarea>
      
      <!-- Preview View (Hidden by default) -->
      <div id="output-preview" 
           class="hidden w-full h-64 md:h-96 lg:h-[500px]
                  p-4 overflow-auto
                  bg-surface-light dark:bg-surface-dark 
                  text-text-light dark:text-text-dark 
                  border border-muted-light/30 dark:border-accent-dark/30 
                  rounded-lg 
                  prose dark:prose-invert max-w-none"
           aria-label="Output preview">
      </div>
    </div>
    
  </div>
  
  <!-- Status Message Area -->
  <div id="status-message" class="mt-6" role="status" aria-live="polite"></div>
  
</section>
```

---

### 3. Text Diff Checker

**Icon:** `difference`  
**Description:** "Compare text and code with line-by-line diff highlighting"  
**Layout Pattern:** Comparison Tool (Pattern B)

**Tool-Specific Content Area:**

```html
<section class="tool-content-area">
  
  <!-- Controls Section -->
  <div class="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
    
    <!-- Options -->
    <div class="flex flex-wrap items-center gap-4">
      <label class="flex items-center gap-2 text-sm text-text-light dark:text-text-dark cursor-pointer">
        <input type="checkbox" id="ignore-whitespace" 
               class="w-4 h-4 text-primary border-muted-light/30 dark:border-accent-dark/30 rounded focus:ring-primary dark:focus:ring-primary-dark">
        <span>Ignore Whitespace</span>
      </label>
      <label class="flex items-center gap-2 text-sm text-text-light dark:text-text-dark cursor-pointer">
        <input type="checkbox" id="ignore-case" 
               class="w-4 h-4 text-primary border-muted-light/30 dark:border-accent-dark/30 rounded focus:ring-primary dark:focus:ring-primary-dark">
        <span>Ignore Case</span>
      </label>
      <label class="flex items-center gap-2 text-sm text-text-light dark:text-text-dark cursor-pointer">
        <input type="checkbox" id="char-level-diff" 
               class="w-4 h-4 text-primary border-muted-light/30 dark:border-accent-dark/30 rounded focus:ring-primary dark:focus:ring-primary-dark">
        <span>Character-Level Diff</span>
      </label>
    </div>
    
    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button id="compare-btn" class="btn-primary">
        <span class="material-symbols-outlined">compare</span>
        <span>Compare</span>
      </button>
      <button id="clear-btn" 
              class="px-4 py-2 bg-transparent border border-primary/30 dark:border-primary-dark/30 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all">
        <span class="material-symbols-outlined mr-2">delete</span>
        <span>Clear</span>
      </button>
      <button id="sample-btn" 
              class="px-4 py-2 bg-transparent border border-primary/30 dark:border-primary-dark/30 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all">
        <span class="material-symbols-outlined mr-2">description</span>
        <span>Sample</span>
      </button>
    </div>
  </div>
  
  <!-- Editor Section: Original | Modified -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    
    <!-- Original Text -->
    <div class="flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark">
          Original Text
        </h3>
        <span class="text-xs text-muted-light dark:text-muted-dark" id="original-count">0 characters</span>
      </div>
      
      <textarea 
        id="original-text"
        class="w-full h-64 md:h-80
               p-4 
               bg-surface-light dark:bg-surface-dark 
               text-text-light dark:text-text-dark 
               border border-muted-light/30 dark:border-accent-dark/30 
               rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark 
               font-mono text-sm 
               resize-none
               transition-all"
        placeholder="Paste or type original text here..."
        spellcheck="false"
        aria-label="Original text input"
        aria-describedby="original-count"
      ></textarea>
    </div>
    
    <!-- Modified Text -->
    <div class="flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark">
          Modified Text
        </h3>
        <span class="text-xs text-muted-light dark:text-muted-dark" id="modified-count">0 characters</span>
      </div>
      
      <textarea 
        id="modified-text"
        class="w-full h-64 md:h-80
               p-4 
               bg-surface-light dark:bg-surface-dark 
               text-text-light dark:text-text-dark 
               border border-muted-light/30 dark:border-accent-dark/30 
               rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark 
               font-mono text-sm 
               resize-none
               transition-all"
        placeholder="Paste or type modified text here..."
        spellcheck="false"
        aria-label="Modified text input"
        aria-describedby="modified-count"
      ></textarea>
    </div>
    
  </div>
  
  <!-- Results Section -->
  <div id="results-section" class="hidden" role="region" aria-label="Text comparison results">
    
    <!-- Statistics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" role="status" aria-live="polite">
      
      <div class="p-4 bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
        <div class="text-2xl font-bold text-green-700 dark:text-green-300" id="stat-added">0</div>
        <div class="text-sm text-green-600 dark:text-green-400">Lines Added</div>
      </div>
      
      <div class="p-4 bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
        <div class="text-2xl font-bold text-red-700 dark:text-red-300" id="stat-removed">0</div>
        <div class="text-sm text-red-600 dark:text-red-400">Lines Removed</div>
      </div>
      
      <div class="p-4 bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
        <div class="text-2xl font-bold text-yellow-700 dark:text-yellow-300" id="stat-modified">0</div>
        <div class="text-sm text-yellow-600 dark:text-yellow-400">Lines Modified</div>
      </div>
      
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-400 rounded-r-lg">
        <div class="text-2xl font-bold text-gray-700 dark:text-gray-300" id="stat-unchanged">0</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Lines Unchanged</div>
      </div>
      
    </div>
    
    <!-- Diff Display -->
    <div class="p-6 bg-surface-light dark:bg-surface-dark rounded-lg border border-muted-light/20 dark:border-accent-dark/20 theme-shadow">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark">
          Differences
        </h3>
        <button class="btn-icon" aria-label="Copy diff output">
          <span class="material-symbols-outlined">content_copy</span>
        </button>
      </div>
      
      <div id="diff-output" 
           class="font-mono text-sm overflow-x-auto"
           role="region"
           aria-label="Diff output">
        <!-- Diff content rendered here by JavaScript using diff library -->
      </div>
    </div>
    
  </div>
  
</section>
```

**Tool-Specific CSS (text-diff.css):**
```css
/* Diff line styling */
.diff-line-added {
  background-color: rgba(34, 197, 94, 0.1);
  border-left: 3px solid #22c55e;
  padding-left: 0.5rem;
}

.diff-line-removed {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
  padding-left: 0.5rem;
}

.diff-line-unchanged {
  background-color: transparent;
  padding-left: 0.5rem;
}

.dark .diff-line-added {
  background-color: rgba(34, 197, 94, 0.05);
}

.dark .diff-line-removed {
  background-color: rgba(239, 68, 68, 0.05);
}

/* Line numbers */
.diff-line-number {
  display: inline-block;
  width: 3rem;
  text-align: right;
  margin-right: 1rem;
  color: var(--color-muted-light);
  user-select: none;
}

.dark .diff-line-number {
  color: var(--color-muted-dark);
}
```

---

### 4. SIP Calculator

**Icon:** `trending_up`  
**Description:** "Calculate returns from Systematic Investment Plans with growth visualization"  
**Layout Pattern:** Calculator Form → Results (Pattern C)

**Tool-Specific Content Area:**

```html
<section class="tool-content-area">
  
  <!-- Calculator Form -->
  <div class="max-w-3xl mx-auto mb-8">
    <div class="p-6 md:p-8 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
      
      <h2 class="font-heading text-2xl text-text-light dark:text-text-dark mb-6">
        Investment Details
      </h2>
      
      <form id="sip-form" class="space-y-5">
        
        <!-- Monthly Investment -->
        <div class="form-group">
          <label for="monthly-investment" class="block mb-2 text-sm font-medium text-text-light dark:text-text-dark">
            Monthly Investment (₹)
            <span class="text-red-500">*</span>
          </label>
          <input type="number" 
                 id="monthly-investment"
                 class="w-full px-4 py-3 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-muted-light/30 dark:border-accent-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all"
                 placeholder="5000"
                 min="500"
                 max="10000000"
                 step="500"
                 value="5000"
                 required
                 aria-describedby="monthly-investment-help" />
          <small id="monthly-investment-help" class="block mt-1 text-xs text-muted-light dark:text-muted-dark">
            Minimum: ₹500, Maximum: ₹1,00,00,000
          </small>
        </div>
        
        <!-- Expected Return Rate -->
        <div class="form-group">
          <label for="return-rate" class="block mb-2 text-sm font-medium text-text-light dark:text-text-dark">
            Expected Annual Return (%)
            <span class="text-red-500">*</span>
          </label>
          <input type="number" 
                 id="return-rate"
                 class="w-full px-4 py-3 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-muted-light/30 dark:border-accent-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all"
                 placeholder="12"
                 min="1"
                 max="30"
                 step="0.5"
                 value="12"
                 required
                 aria-describedby="return-rate-help" />
          <small id="return-rate-help" class="block mt-1 text-xs text-muted-light dark:text-muted-dark">
            Historical equity mutual fund returns: 10-15% p.a.
          </small>
        </div>
        
        <!-- Investment Duration -->
        <div class="form-group">
          <label for="duration" class="block mb-2 text-sm font-medium text-text-light dark:text-text-dark">
            Investment Duration (Years)
            <span class="text-red-500">*</span>
          </label>
          <input type="number" 
                 id="duration"
                 class="w-full px-4 py-3 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-muted-light/30 dark:border-accent-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all"
                 placeholder="10"
                 min="1"
                 max="50"
                 step="1"
                 value="10"
                 required
                 aria-describedby="duration-help" />
          <small id="duration-help" class="block mt-1 text-xs text-muted-light dark:text-muted-dark">
            Long-term investments (5+ years) show better compounding
          </small>
        </div>
        
        <!-- Step-up Rate (Optional) -->
        <div class="form-group">
          <label for="stepup-rate" class="block mb-2 text-sm font-medium text-text-light dark:text-text-dark">
            Annual Step-Up Rate (%) 
            <span class="text-muted-light dark:text-muted-dark text-xs">[Optional]</span>
          </label>
          <input type="number" 
                 id="stepup-rate"
                 class="w-full px-4 py-3 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-muted-light/30 dark:border-accent-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all"
                 placeholder="0"
                 min="0"
                 max="50"
                 step="1"
                 value="0"
                 aria-describedby="stepup-rate-help" />
          <small id="stepup-rate-help" class="block mt-1 text-xs text-muted-light dark:text-muted-dark">
            Increase monthly investment by this % each year (0 = no step-up)
          </small>
        </div>
        
        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <button type="submit" 
                  id="calculate-btn"
                  class="w-full sm:w-auto btn-primary">
            <span class="material-symbols-outlined">calculate</span>
            <span>Calculate Returns</span>
          </button>
          <button type="button" 
                  id="reset-btn"
                  class="w-full sm:w-auto px-4 py-2 bg-transparent border border-primary/30 dark:border-primary-dark/30 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all">
            <span class="material-symbols-outlined mr-2">refresh</span>
            <span>Reset</span>
          </button>
        </div>
        
      </form>
    </div>
  </div>
  
  <!-- Results Section -->
  <div id="results-section" class="hidden" role="region" aria-label="SIP calculation results">
    
    <h2 class="font-heading text-2xl text-text-light dark:text-text-dark mb-6 text-center">
      Investment Results
    </h2>
    
    <!-- Summary Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" role="status" aria-live="polite">
      
      <!-- Total Value Card -->
      <div class="p-6 bg-surface-light dark:bg-surface-dark border-l-4 border-primary rounded-r-lg theme-shadow">
        <div class="text-sm font-medium text-muted-light dark:text-muted-dark mb-2">
          Maturity Value
        </div>
        <div class="text-3xl font-bold text-primary dark:text-primary-dark" id="total-value">
          ₹0
        </div>
      </div>
      
      <!-- Invested Amount Card -->
      <div class="p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
        <div class="text-sm font-medium text-muted-light dark:text-muted-dark mb-2">
          Total Invested
        </div>
        <div class="text-3xl font-bold text-text-light dark:text-text-dark" id="invested-amount">
          ₹0
        </div>
      </div>
      
      <!-- Wealth Gained Card -->
      <div class="p-6 bg-surface-light dark:bg-surface-dark border-l-4 border-green-500 rounded-r-lg theme-shadow">
        <div class="text-sm font-medium text-muted-light dark:text-muted-dark mb-2">
          Wealth Gained
        </div>
        <div class="text-3xl font-bold text-green-600 dark:text-green-400" id="wealth-gained">
          ₹0
        </div>
      </div>
      
    </div>
    
    <!-- Chart Visualization -->
    <div class="p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow mb-8">
      <h3 class="font-heading text-xl text-text-light dark:text-text-dark mb-4">
        Growth Visualization
      </h3>
      <div class="w-full h-80">
        <canvas id="sip-chart" aria-label="SIP growth chart visualization"></canvas>
      </div>
    </div>
    
    <!-- Detailed Breakdown Table (Optional) -->
    <div class="p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
      <h3 class="font-heading text-xl text-text-light dark:text-text-dark mb-4">
        Year-wise Breakdown
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm" id="breakdown-table">
          <thead>
            <tr class="border-b border-muted-light/20 dark:border-muted-dark/20">
              <th class="text-left py-3 px-4 font-medium text-muted-light dark:text-muted-dark">Year</th>
              <th class="text-right py-3 px-4 font-medium text-muted-light dark:text-muted-dark">Invested</th>
              <th class="text-right py-3 px-4 font-medium text-muted-light dark:text-muted-dark">Interest</th>
              <th class="text-right py-3 px-4 font-medium text-muted-light dark:text-muted-dark">Total Value</th>
            </tr>
          </thead>
          <tbody id="breakdown-tbody" class="text-text-light dark:text-text-dark">
            <!-- Populated by JavaScript -->
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
  
</section>
```

**Chart.js Heritage Integration:**

Update Chart.js colors to match Heritage palette:

```javascript
// Chart.js configuration for Heritage theme
const chartConfig = {
  type: 'line',
  data: {
    labels: years,
    datasets: [
      {
        label: 'Total Value',
        data: totalValues,
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
        backgroundColor: 'rgba(255, 107, 53, 0.1)', // semi-transparent primary
        borderWidth: 3,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Invested Amount',
        data: investedAmounts,
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-muted-light').trim(),
        backgroundColor: 'rgba(200, 200, 200, 0.05)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--color-text-light').trim(),
          font: {
            family: 'Plus Jakarta Sans',
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--color-muted-light').trim(),
          font: {
            family: 'Plus Jakarta Sans'
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      },
      y: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--color-muted-light').trim(),
          font: {
            family: 'Plus Jakarta Sans'
          },
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      }
    }
  }
};
```

---

### 5. EMI Calculator

**Icon:** `account_balance`  
**Description:** "Calculate home loan EMI and optimize prepayment strategies"  
**Layout Pattern:** Calculator Form → Results (Pattern C)

**Tool-Specific Content Area:**

```html
<section class="tool-content-area">
  
  <!-- Loan Details Form -->
  <div class="max-w-3xl mx-auto mb-8">
    <div class="p-6 md:p-8 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
      
      <h2 class="font-heading text-2xl text-text-light dark:text-text-dark mb-6">
        Loan Details
      </h2>
      
      <form id="emi-form" class="space-y-5">
        
        <!-- Loan Amount -->
        <div class="form-group">
          <label for="loan-amount" class="block mb-2 text-sm font-medium text-text-light dark:text-text-dark">
            Loan Amount (₹)
            <span class="text-red-500">*</span>
          </label>
          <input type="number" 
                 id="loan-amount"
                 class="w-full px-4 py-3 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-muted-light/30 dark:border-accent-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all"
                 placeholder="2500000"
                 min="100000"
                 max="100000000"
                 step="100000"
                 value="2500000"
                 required
                 aria-describedby="loan-amount-help" />
          <small id="loan-amount-help" class="block mt-1 text-xs text-muted-light dark:text-muted-dark">
            Minimum: ₹1,00,000 | Maximum: ₹10,00,00,000
          </small>
        </div>
        
        <!-- Interest Rate -->
        <div class="form-group">
          <label for="interest-rate" class="block mb-2 text-sm font-medium text-text-light dark:text-text-dark">
            Annual Interest Rate (%)
            <span class="text-red-500">*</span>
          </label>
          <input type="number" 
                 id="interest-rate"
                 class="w-full px-4 py-3 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-muted-light/30 dark:border-accent-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all"
                 placeholder="8.5"
                 min="1"
                 max="20"
                 step="0.1"
                 value="8.5"
                 required
                 aria-describedby="interest-rate-help" />
          <small id="interest-rate-help" class="block mt-1 text-xs text-muted-light dark:text-muted-dark">
            Current home loan rates: 8-10% p.a.
          </small>
        </div>
        
        <!-- Loan Tenure -->
        <div class="form-group">
          <label for="loan-tenure" class="block mb-2 text-sm font-medium text-text-light dark:text-text-dark">
            Loan Tenure (Years)
            <span class="text-red-500">*</span>
          </label>
          <input type="number" 
                 id="loan-tenure"
                 class="w-full px-4 py-3 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-muted-light/30 dark:border-accent-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all"
                 placeholder="20"
                 min="1"
                 max="30"
                 step="1"
                 value="20"
                 required
                 aria-describedby="loan-tenure-help" />
          <small id="loan-tenure-help" class="block mt-1 text-xs text-muted-light dark:text-muted-dark">
            Typical tenures: 15-20 years
          </small>
        </div>
        
        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <button type="button" 
                  id="calculate-btn"
                  class="w-full sm:w-auto btn-primary">
            <span class="material-symbols-outlined">calculate</span>
            <span>Calculate EMI</span>
          </button>
          <button type="button" 
                  id="reset-btn"
                  class="w-full sm:w-auto px-4 py-2 bg-transparent border border-primary/30 dark:border-primary-dark/30 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all">
            <span class="material-symbols-outlined mr-2">refresh</span>
            <span>Reset</span>
          </button>
        </div>
        
      </form>
    </div>
  </div>
  
  <!-- EMI Results Section -->
  <div id="results-section" class="hidden" role="region" aria-label="EMI calculation results">
    
    <h2 class="font-heading text-2xl text-text-light dark:text-text-dark mb-6 text-center">
      EMI Calculation Results
    </h2>
    
    <!-- Summary Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" role="status" aria-live="polite">
      
      <!-- Monthly EMI Card (Primary) -->
      <div class="md:col-span-2 p-6 bg-surface-light dark:bg-surface-dark border-l-4 border-primary rounded-r-lg theme-shadow">
        <div class="text-sm font-medium text-muted-light dark:text-muted-dark mb-2">
          Monthly EMI
        </div>
        <div class="text-4xl font-bold text-primary dark:text-primary-dark" id="monthly-emi">
          ₹0
        </div>
      </div>
      
      <!-- Principal Amount Card -->
      <div class="p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
        <div class="text-sm font-medium text-muted-light dark:text-muted-dark mb-2">
          Loan Amount
        </div>
        <div class="text-2xl font-bold text-text-light dark:text-text-dark" id="principal-amount">
          ₹0
        </div>
      </div>
      
      <!-- Total Interest Card -->
      <div class="p-6 bg-surface-light dark:bg-surface-dark border-l-4 border-red-500 rounded-r-lg theme-shadow">
        <div class="text-sm font-medium text-muted-light dark:text-muted-dark mb-2">
          Total Interest
        </div>
        <div class="text-2xl font-bold text-red-600 dark:text-red-400" id="total-interest">
          ₹0
        </div>
      </div>
      
      <!-- Total Amount Card -->
      <div class="md:col-span-2 p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
        <div class="text-sm font-medium text-muted-light dark:text-muted-dark mb-2">
          Total Amount Payable
        </div>
        <div class="text-3xl font-bold text-text-light dark:text-text-dark" id="total-amount">
          ₹0
        </div>
      </div>
      
      <!-- Interest to Principal Ratio Card -->
      <div class="md:col-span-2 p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
        <div class="text-sm font-medium text-muted-light dark:text-muted-dark mb-2">
          Interest / Principal Ratio
        </div>
        <div class="text-3xl font-bold text-text-light dark:text-text-dark" id="interest-ratio">
          0%
        </div>
      </div>
      
    </div>
    
    <!-- Principal vs Interest Donut Chart -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      <div class="p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark mb-4">
          Principal vs Interest
        </h3>
        <div class="w-full h-64 flex items-center justify-center">
          <canvas id="donut-chart" aria-label="Principal vs Interest pie chart"></canvas>
        </div>
      </div>
      
      <!-- Amortization Chart -->
      <div class="p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark mb-4">
          Payment Breakdown Over Time
        </h3>
        <div class="w-full h-64">
          <canvas id="amortization-chart" aria-label="Amortization chart showing principal and interest over time"></canvas>
        </div>
      </div>
      
    </div>
    
    <!-- Amortization Schedule Table -->
    <div class="p-6 bg-surface-light dark:bg-surface-dark rounded-lg theme-shadow">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-heading text-xl text-text-light dark:text-text-dark">
          Amortization Schedule
        </h3>
        <button class="btn-icon" aria-label="Download schedule as CSV">
          <span class="material-symbols-outlined">download</span>
        </button>
      </div>
      <div class="overflow-x-auto max-h-96 overflow-y-auto">
        <table class="w-full text-sm" id="amortization-table">
          <thead class="sticky top-0 bg-surface-light dark:bg-surface-dark">
            <tr class="border-b border-muted-light/20 dark:border-muted-dark/20">
              <th class="text-left py-3 px-4 font-medium text-muted-light dark:text-muted-dark">Month</th>
              <th class="text-right py-3 px-4 font-medium text-muted-light dark:text-muted-dark">EMI</th>
              <th class="text-right py-3 px-4 font-medium text-muted-light dark:text-muted-dark">Principal</th>
              <th class="text-right py-3 px-4 font-medium text-muted-light dark:text-muted-dark">Interest</th>
              <th class="text-right py-3 px-4 font-medium text-muted-light dark:text-muted-dark">Balance</th>
            </tr>
          </thead>
          <tbody id="amortization-tbody" class="text-text-light dark:text-text-dark">
            <!-- Populated by JavaScript -->
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
  
</section>
```

---

## Responsive Behavior

### Breakpoint Summary

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| **Mobile** | <768px | Single column, stacked layouts, full-width inputs, 16px padding |
| **Tablet** | 768-1023px | Two columns where appropriate, 40px padding, side-by-side views |
| **Desktop** | ≥1024px | Multi-column optimized, 80px padding, max-width 1440px |

### Responsive Patterns by Tool Type

**Text Editor Tools (JSON, HTML/Markdown):**
- Mobile: Input → Actions → Output (stacked)
- Tablet+: Input | Output (side-by-side 50/50)
- Desktop: Same as tablet, larger textarea heights

**Comparison Tool (Text Diff):**
- Mobile: Controls → Original → Modified → Diff Results (stacked)
- Tablet: Controls → Original | Modified (side-by-side) → Diff Results
- Desktop: Three-pane side-by-side if space permits

**Calculator Tools (SIP, EMI):**
- Mobile: Form (full-width) → Results (stacked cards, 1 column)
- Tablet: Form (full-width) → Results (2-column grid) → Chart (full-width)
- Desktop: Form (constrained width) → Results (3-column grid) → Charts (side-by-side)

---

## Theme Integration

### Dual-Theme Support

All tool pages support Heritage Evolution's dual-theme system:

**Light Mode (Indic Futurism):**
- Background: `#FDFBF7` (warm off-white)
- Surface: `#FFFFFF` (pure white)
- Primary: `#C84B31` (terracotta)
- Accent: `#E3A857` (honey gold)
- Text: `#2D2A26` (dark brown)
- Shadows: Soft drop shadows (rgba(0,0,0,0.1))
- Borders: Transparent or very subtle

**Dark Mode (Neon Heritage):**
- Background: `#08080C` (near black)
- Surface: `#12131C` (dark gray)
- Primary: `#FF6B35` (neon orange)
- Accent: `#00F0FF` (cyan)
- Text: `#E8E9F3` (off-white)
- Shadows: Neon glows (radial-gradient)
- Borders: Cyan glow (intensifies on hover)

### Theme-Specific Custom Classes

**`.theme-shadow`** - Adapts shadow based on theme:
```css
.theme-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark .theme-shadow {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
}
```

**`.theme-border`** - Border that appears/glows in dark mode:
```css
.theme-border {
  border: 1px solid transparent;
}

.dark .theme-border {
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.dark .theme-border:hover {
  border-color: rgba(0, 240, 255, 0.6);
}
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance (Targeting AAA)

**1. Color Contrast:**
- Regular text: Minimum 4.5:1 (targeting 7:1 for AAA)
- Large text (18px+): Minimum 3:1 (targeting 4.5:1)
- UI components: Minimum 3:1

**2. Keyboard Navigation:**
- All interactive elements accessible via Tab key
- Logical tab order (top to bottom, left to right)
- Visible focus indicators (2px solid outline, 2px offset)
- Enter/Space to activate buttons
- Escape to close modals/dialogs

**3. ARIA Labels:**
- All form inputs have proper labels
- Icon-only buttons have `aria-label`
- Dynamic content regions have `aria-live`
- Form validation messages use `role="alert"`
- Results sections use `role="region"` with `aria-label`

**4. Semantic HTML:**
- Proper heading hierarchy (H1 → H2 → H3)
- Use `<button>` for actions, not `<div>`
- Forms use `<label>`, `<fieldset>`, `<legend>`
- Tables have `<thead>`, `<tbody>`, proper headers
- Lists use `<ul>`, `<ol>`, `<li>`

**5. Screen Reader Support:**
- Descriptive link text (not "click here")
- Form help text associated with `aria-describedby`
- Status messages announced with `aria-live="polite"` or `aria-live="assertive"`
- Hidden content uses `aria-hidden` or `hidden` attribute
- Loading states communicated

**6. Touch Targets:**
- Minimum 44x44px for mobile touch targets
- Adequate spacing between interactive elements
- Large click/tap areas for buttons and links

---

## Performance Considerations

### Performance Metrics Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Initial Load Time** | <3s on 3G | Critical for mobile users |
| **CSS Bundle Size** | <100KB | Utilities + themes total |
| **JavaScript Load** | <50KB (excluding libs) | Tool-specific JS only |
| **First Contentful Paint** | <1.5s | User sees content quickly |
| **Time to Interactive** | <3.5s | User can interact |

### Optimization Strategies

**1. CSS Optimization:**
- Use utility classes (reduces custom CSS)
- Share common components across tools
- Minimize tool-specific CSS
- Critical CSS inline (FOUC prevention)
- Load fonts with `font-display: swap`

**2. JavaScript Optimization:**
- Defer non-critical scripts
- Load tool-specific JS only when needed
- Use ES modules for tree-shaking
- Minify production JavaScript
- Lazy load Chart.js only for calculators

**3. Asset Optimization:**
- Material Symbols loaded from Google Fonts CDN
- Preconnect to Google Fonts domain
- Use `loading="lazy"` for images (if any)
- No unnecessary third-party scripts

**4. Preserve Existing Performance:**
- No additional dependencies beyond current stack
- Chart.js already loaded for calculators
- DOMPurify already loaded for HTML sanitization
- Marked/Turndown already loaded for markdown

**5. Minimize Custom CSS:**
- Utility classes cover 90% of styling
- Tool-specific CSS <5KB per tool
- Shared component CSS reused
- No CSS-in-JS overhead

---

## Implementation Checklist

### Phase 3.1: Design Complete ✅
- [x] Universal tool page template designed
- [x] Shared components library defined
- [x] Tool-specific layouts specified (all 5 tools)
- [x] Responsive behavior documented
- [x] Theme integration detailed
- [x] Accessibility requirements listed
- [x] Complete HTML examples provided

### Phase 3.2: Implementation (front-end-developer)
- [ ] Update JSON Schema tool page
- [ ] Update HTML/Markdown tool page
- [ ] Update Text Diff tool page
- [ ] Update SIP Calculator tool page
- [ ] Update EMI Calculator tool page
- [ ] Test theme toggle on all tool pages
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Verify all tool functionality preserved

### Phase 3.3: Testing (test-specialist)
- [ ] Visual regression testing (compare before/after)
- [ ] Functional testing (all features work)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance testing (Lighthouse, WebPageTest)
- [ ] Mobile testing (real devices)

### Phase 3.4: Documentation (doc-writer)
- [ ] Update tool documentation
- [ ] Create migration guide (if needed)
- [ ] Update testing guides
- [ ] Document known issues (if any)
- [ ] Create Phase 3 completion report

---

## Complete HTML Examples

### Example: Complete JSON Schema Tool Page

See **Tool Page Designs → 1. JSON Schema Validator** above for complete HTML.

### Example: Complete SIP Calculator Tool Page

See **Tool Page Designs → 4. SIP Calculator** above for complete HTML.

---

## Implementation Guidance for front-end-developer

### Step-by-Step Implementation Process

**For Each Tool:**

1. **Backup current tool:**
   ```bash
   cp tools/json-schema/index.html tools/json-schema/index.html.backup
   ```

2. **Replace `<head>` section:**
   - Use universal template `<head>`
   - Update `<title>` and meta description
   - Ensure all CSS files loaded in order

3. **Replace header component:**
   - Use shared header from universal template
   - Update breadcrumb with tool name

4. **Add tool hero section:**
   - Use hero component template
   - Update icon, title, description

5. **Rebuild tool content area:**
   - Use tool-specific HTML from this spec
   - Preserve all existing IDs, data attributes
   - Keep existing JavaScript hooks

6. **Test thoroughly:**
   - Theme toggle works
   - All tool features functional
   - Responsive on mobile/tablet/desktop
   - No console errors

7. **Commit changes:**
   ```bash
   git add tools/json-schema/index.html
   git commit -m "feat: apply Heritage design to JSON Schema tool"
   ```

### Critical: Preserve Functionality

**DO NOT CHANGE:**
- Element IDs (e.g., `#json-input`, `#monthly-investment`)
- Data attributes (e.g., `data-theme-toggle`)
- Event handlers (existing JavaScript expects these)
- Form names and structure (validation logic depends on these)
- Library integrations (Chart.js, DOMPurify, Marked, Turndown)

**CHANGE ONLY:**
- HTML structure and layout
- CSS classes (replace with utility classes)
- Visual styling (colors, spacing, shadows)
- Responsive behavior (breakpoints, grid layouts)

### Testing Each Tool

After implementing each tool, verify:

1. **Visual Testing:**
   - Matches design spec screenshots
   - Both themes render correctly
   - No visual regressions

2. **Functional Testing:**
   - All buttons work
   - All inputs accept values
   - All calculations correct
   - All conversions work
   - All validations function

3. **Responsive Testing:**
   - Works on mobile (375px)
   - Works on tablet (768px)
   - Works on desktop (1440px)
   - No horizontal scroll
   - Touch targets adequate

4. **Accessibility Testing:**
   - Tab through all elements
   - Focus indicators visible
   - Screen reader announcements
   - Form labels associated
   - Color contrast meets AA

---

## Success Criteria

Phase 3 is complete when:

✅ All 5 tool pages redesigned with Heritage design  
✅ Universal template applied consistently  
✅ Shared components reused (header, breadcrumb, hero)  
✅ Tool-specific layouts implemented correctly  
✅ All existing functionality preserved (100%)  
✅ Theme toggle works on all tool pages  
✅ Responsive behavior correct (mobile/tablet/desktop)  
✅ Accessibility standards met (WCAG 2.1 AA)  
✅ Performance maintained (<3s load time)  
✅ No visual regressions  
✅ All tests pass (functional, visual, accessibility)  
✅ Documentation updated  

---

## Appendix: Material Symbols Icon Reference

| Tool | Icon Name | Usage |
|------|-----------|-------|
| Homepage Logo | `temple_hindu` | Heritage branding |
| JSON Schema | `data_object` | JSON/data representation |
| HTML/Markdown | `code_blocks` | Code conversion |
| Text Diff | `difference` | Comparison/differences |
| SIP Calculator | `trending_up` | Investment growth |
| EMI Calculator | `account_balance` | Banking/loans |
| Theme Toggle | `light_mode` / `dark_mode` | Theme switcher |
| Validate | `check_circle` | Validation success |
| Error | `error` | Validation error |
| Warning | `warning` | Warning state |
| Info | `info` | Information |
| Copy | `content_copy` | Copy to clipboard |
| Download | `download` | Download file |
| Delete | `delete` / `delete_outline` | Clear/remove |
| Paste | `content_paste` | Paste from clipboard |
| Calculate | `calculate` | Calculation action |
| Refresh | `refresh` | Reset/reload |
| Menu | `menu` | Mobile hamburger menu |
| Chevron Right | `chevron_right` | Breadcrumb separator |

**Font Loading:**
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
```

**Usage:**
```html
<span class="material-symbols-outlined">icon_name</span>
```

---

**End of Tool Pages Design Specification**

**Next Steps:** Hand off to @front-end-developer for implementation.
