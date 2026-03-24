# Heritage v1 → v2 Migration Guide

**Version:** 2.0  
**Date:** March 23, 2026  
**Audience:** Developers migrating existing components  
**Related:** [UTILITY_CLASS_SYSTEM.md](./UTILITY_CLASS_SYSTEM.md), [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## 📋 Table of Contents

1. [What Changed](#what-changed)
2. [Why These Changes](#why-these-changes)
3. [CSS Migration Patterns](#css-migration-patterns)
4. [Theme System Migration](#theme-system-migration)
5. [JavaScript Migration](#javascript-migration)
6. [Step-by-Step Component Migration](#step-by-step-component-migration)
7. [Testing Checklist](#testing-checklist)
8. [Common Pitfalls](#common-pitfalls)

---

## What Changed

### Major Changes in v2

#### 1. Utility-First CSS Approach

**v1 (Custom CSS):**
```css
.tool-card {
  display: flex;
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: 0.5rem;
}
```

**v2 (Utility Classes):**
```html
<div class="flex p-6 bg-surface-light dark:bg-surface-dark rounded-lg">
```

#### 2. Class-Based Theme System

**v1 (Data Attribute):**
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```
```css
[data-theme="dark"] .card { background: #12131C; }
```

**v2 (CSS Class):**
```javascript
document.documentElement.classList.add('dark');
```
```css
.dark .dark\:bg-surface-dark { background: #12131C; }
```

#### 3. Material Symbols Icons

**v1:** Custom SVG icons or no icons

**v2:** Material Symbols Outlined
```html
<span class="material-symbols-outlined">temple_hindu</span>
```

#### 4. localStorage Key Change

**v1:** Varied by page (`devtools-theme`, `theme`, etc.)

**v2:** Standardized as `devtoolbox_theme`

---

## Why These Changes

### 1. Better Developer Experience

**Utility Classes Reduce Cognitive Load:**
- No need to create unique class names
- See styling directly in HTML
- Faster iteration and prototyping
- Easier to maintain consistency

### 2. Improved Performance

**Class-Based Theming is Faster:**
- Simpler CSS selectors (`.dark` vs `[data-theme="dark"]`)
- Better browser optimization
- Reduced reflow/repaint operations

### 3. Industry Standards

**Following Best Practices:**
- Class-based theming used by Tailwind, shadcn/ui, etc.
- Material Symbols = Google's standard icon system
- Responsive mobile-first approach

### 4. Easier Maintenance

**Consistency Across Platform:**
- One utility system for all pages
- Standardized theme management
- Predictable behavior across tools

---

## CSS Migration Patterns

### Pattern 1: Layout (Flexbox)

#### Before (v1)
```css
/* custom.css */
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem 2rem;
}
```
```html
<nav class="navigation">
  <!-- Content -->
</nav>
```

#### After (v2)
```html
<nav class="flex items-center justify-between gap-8 px-8 py-4">
  <!-- Content -->
</nav>
```

**Mapping:**
- `display: flex` → `.flex`
- `align-items: center` → `.items-center`
- `justify-content: space-between` → `.justify-between`
- `gap: 2rem` → `.gap-8` (32px = 2rem)
- `padding: 1rem 2rem` → `.py-4 px-8`

---

### Pattern 2: Responsive Grid

#### Before (v1)
```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### After (v2)
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <!-- Cards -->
</div>
```

**Benefits:**
- No CSS file needed
- Breakpoints visible in markup
- Mobile-first approach built-in

---

### Pattern 3: Typography

#### Before (v1)
```css
.page-title {
  font-family: 'Rozha One', serif;
  font-size: 3rem;
  font-weight: 400;
  line-height: 1;
  color: var(--color-text-primary);
}

@media (min-width: 768px) {
  .page-title {
    font-size: 3.75rem;
  }
}
```

#### After (v2)
```html
<h1 class="font-heading text-5xl md:text-6xl font-normal leading-none text-text-light dark:text-text-dark">
  Page Title
</h1>
```

**Mapping:**
- `font-family: 'Rozha One'` → `.font-heading`
- `font-size: 3rem` → `.text-5xl`
- `font-size: 3.75rem` (md) → `.md:text-6xl`
- `font-weight: 400` → `.font-normal`
- `line-height: 1` → `.leading-none`
- Theme-aware color → `.text-text-light .dark:text-text-dark`

---

### Pattern 4: Cards with Theme Support

#### Before (v1)
```css
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.tool-card:hover {
  transform: translateY(-0.25rem);
}

[data-theme="dark"] .tool-card {
  background: var(--color-surface-dark);
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
}
```

#### After (v2)
```html
<article class="
  flex flex-col gap-4 p-6
  bg-surface-light dark:bg-surface-dark
  border border-muted-light/20 dark:border-accent-dark/30
  rounded-lg
  theme-shadow theme-shadow-hover
  transition-transform duration-300
  hover:-translate-y-1
">
  <!-- Content -->
</article>
```

**Key Improvements:**
- All styling in markup
- Automatic theme switching
- Using heritage classes (`theme-shadow`)
- Simplified hover effects

---

### Pattern 5: Buttons

#### Before (v1)
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.85;
}

[data-theme="dark"] .btn-primary {
  background: var(--color-primary-dark);
}
```

#### After (v2)
```html
<button class="
  inline-flex items-center gap-2
  px-6 py-3
  font-semibold text-base
  text-white
  bg-primary dark:bg-primary-dark
  border-none rounded-md
  cursor-pointer
  transition-opacity duration-200
  hover:opacity-85
">
  Click Me
</button>
```

---

## Theme System Migration

### JavaScript Changes

#### v1 Theme Toggle (OLD)
```javascript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// On load
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

#### v2 Theme Toggle (NEW)
```javascript
function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(newTheme);
  localStorage.setItem('devtoolbox_theme', newTheme);
}

// On load (FOUC prevention in <head>)
const savedTheme = localStorage.getItem('devtoolbox_theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = savedTheme || (prefersDark ? 'dark' : 'light');
document.documentElement.classList.add(theme);
```

### CSS Selector Changes

#### v1 (Data Attribute Selectors)
```css
/* Root defaults */
:root {
  --color-background: #FDFBF7;
  --color-text: #2D2A26;
}

/* Dark theme overrides */
[data-theme="dark"] {
  --color-background: #08080C;
  --color-text: #E8E9F3;
}

/* Component styles */
[data-theme="dark"] .card {
  background: var(--color-surface-dark);
}
```

#### v2 (Class Selectors)
```css
/* Root: Dark defaults */
:root {
  --color-background: #08080C;
  --color-text: #E8E9F3;
}

/* Light theme overrides */
.light {
  --color-background: #FDFBF7;
  --color-text: #2D2A26;
}

/* Component styles with utilities */
.bg-surface-light { background: #F4EFE6; }
.dark .dark\:bg-surface-dark { background: #12131C; }
```

---

## JavaScript Migration

### Complete Before/After Example

#### v1 Implementation
```html
<!-- HTML -->
<button id="themeToggle" onclick="toggleTheme()">
  <svg id="themeIcon">...</svg>
</button>

<script>
  const THEME_KEY = 'app-theme';
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateIcon(theme);
  }
  
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }
  
  function updateIcon(theme) {
    const icon = document.getElementById('themeIcon');
    icon.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
  
  // Initialize
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  setTheme(saved);
</script>
```

#### v2 Implementation
```html
<!-- HTML -->
<button data-theme-toggle aria-label="Toggle theme">
  <span class="material-symbols-outlined theme-icon">dark_mode</span>
</button>

<!-- FOUC Prevention (in <head>) -->
<script>
  (function() {
    const savedTheme = localStorage.getItem('devtoolbox_theme');
    const prefersDark = window.matchMedia && 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  })();
</script>

<!-- Theme Toggle Logic (in <body> or external file) -->
<script>
  const THEME_KEY = 'devtoolbox_theme';
  
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  
  function setTheme(theme) {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
  }
  
  function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }
  
  function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }
  
  // Attach event listener
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
      updateThemeIcon(getTheme());
    }
  });
</script>
```

---

## Step-by-Step Component Migration

### Example: Migrating a Tool Card Component

#### Step 1: Identify Current Styles

**v1 CSS (`tool-card.css`):**
```css
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.tool-card:hover {
  transform: scale(1.02);
}

.tool-card-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 200px 200px 0 0;
}

[data-theme="dark"] .tool-card {
  background: var(--color-surface-dark);
  border-color: rgba(0, 240, 255, 0.3);
}

[data-theme="dark"] .tool-card-image {
  border-radius: 4px;
}
```

#### Step 2: Map to Utility Classes

Create a mapping table:

| v1 CSS Property | v2 Utility Class |
|-----------------|------------------|
| `display: flex` | `.flex` |
| `flex-direction: column` | `.flex-col` |
| `gap: 1rem` | `.gap-4` |
| `padding: 1.5rem` | `.p-6` |
| `background: surface` | `.bg-surface-light .dark:bg-surface-dark` |
| `border: 1px solid rgba(...)` | `.border .border-muted-light/20` |
| `border-radius: 0.5rem` | `.rounded-lg` |
| `transition: all 0.3s` | `.transition-all .duration-300` |
| `transform: scale(1.02)` | `.hover:scale-102` |

#### Step 3: Convert HTML

**v1 HTML:**
```html
<article class="tool-card">
  <img src="..." class="tool-card-image" alt="...">
  <h3 class="tool-card-title">JSON Schema Validator</h3>
  <p class="tool-card-description">Validate JSON against schemas...</p>
</article>
```

**v2 HTML:**
```html
<article class="
  flex flex-col gap-4 p-6
  bg-surface-light dark:bg-surface-dark
  border border-muted-light/20 dark:border-accent-dark/30
  rounded-lg
  theme-shadow
  transition-all duration-300
  hover:scale-102
">
  <img 
    src="..." 
    alt="..."
    class="w-full aspect-[16/9] object-cover theme-image-radius"
  >
  <h3 class="font-heading text-2xl text-text-light dark:text-text-dark">
    JSON Schema Validator
  </h3>
  <p class="text-muted-light dark:text-muted-dark text-sm leading-relaxed">
    Validate JSON against schemas...
  </p>
</article>
```

#### Step 4: Remove Old CSS

Delete or comment out the old CSS file:
```css
/* tool-card.css - NO LONGER NEEDED */
```

#### Step 5: Test

- ✅ Visual appearance matches original
- ✅ Hover effects work
- ✅ Theme toggle switches correctly
- ✅ Responsive behavior maintained

---

## Testing Checklist

### Visual Testing

- [ ] Component looks identical in light mode
- [ ] Component looks identical in dark mode
- [ ] Hover/focus states work correctly
- [ ] Transitions are smooth
- [ ] Icons render properly (Material Symbols)

### Responsive Testing

- [ ] Mobile (320px-767px): Layout correct
- [ ] Tablet (768px-1023px): Layout correct
- [ ] Desktop (1024px+): Layout correct
- [ ] No horizontal scrolling at any breakpoint

### Theme Toggle Testing

- [ ] Toggle button works
- [ ] Theme persists across page reloads
- [ ] No FOUC (Flash of Unstyled Content)
- [ ] System preference detected if no saved theme
- [ ] All components update immediately

### Functionality Testing

- [ ] All interactive elements work (buttons, links, forms)
- [ ] JavaScript functionality unchanged
- [ ] No console errors
- [ ] localStorage key is `devtoolbox_theme`

### Performance Testing

- [ ] Page load time not increased
- [ ] CSS file size reasonable
- [ ] No layout shift or reflow
- [ ] Smooth animations (60 FPS)

---

## Common Pitfalls

### ❌ Pitfall 1: Mixing Theme Systems

**Don't Mix:**
```javascript
// ❌ Wrong - mixing class and attribute
document.documentElement.classList.add('dark');
document.documentElement.setAttribute('data-theme', 'dark');
```

**Do This:**
```javascript
// ✅ Correct - use only classes
document.documentElement.classList.add('dark');
```

### ❌ Pitfall 2: Wrong localStorage Key

**Don't:**
```javascript
// ❌ Old or inconsistent keys
localStorage.setItem('theme', 'dark');
localStorage.setItem('devtools-theme', 'dark');
```

**Do:**
```javascript
// ✅ Standard key
localStorage.setItem('devtoolbox_theme', 'dark');
```

### ❌ Pitfall 3: Forgetting FOUC Prevention

**Don't:**
```html
<!-- ❌ Theme applied too late -->
<body>
  <script>
    const theme = localStorage.getItem('devtoolbox_theme') || 'light';
    document.documentElement.classList.add(theme);
  </script>
</body>
```

**Do:**
```html
<!-- ✅ FOUC prevention in <head> -->
<head>
  <script>
    const theme = localStorage.getItem('devtoolbox_theme') || 'light';
    document.documentElement.classList.add(theme);
  </script>
</head>
```

### ❌ Pitfall 4: Not Using Dark Mode Variants

**Don't:**
```html
<!-- ❌ Only light theme styled -->
<div class="bg-surface-light text-text-light">
```

**Do:**
```html
<!-- ✅ Both themes supported -->
<div class="bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark">
```

### ❌ Pitfall 5: Over-Engineering with Custom CSS

**Don't:**
```css
/* ❌ Creating custom CSS for simple layouts */
.my-custom-flex-container {
  display: flex;
  gap: 1rem;
}
```

**Do:**
```html
<!-- ✅ Use utilities directly -->
<div class="flex gap-4">
```

### ❌ Pitfall 6: Ignoring Responsive Variants

**Don't:**
```html
<!-- ❌ Same layout on all screens -->
<div class="grid grid-cols-3 gap-8">
```

**Do:**
```html
<!-- ✅ Mobile-first responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

---

## Need Help?

**Documentation:**
- [UTILITY_CLASS_SYSTEM.md](./UTILITY_CLASS_SYSTEM.md) - Complete utility reference
- [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md) - Design system overview
- [NEW_DESIGN_ANALYSIS.md](./NEW_DESIGN_ANALYSIS.md) - Original design analysis

**Examples:**
- Check `/index.html` - Homepage with v2 implementation
- Check `/tools/json-schema/index.html` - Tool page example

---

**Last Updated:** March 23, 2026  
**Version:** 2.0
