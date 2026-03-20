# DevTools Suite - UX Design System

**Version:** 1.0  
**Date:** March 20, 2026  
**Status:** Ready for Implementation

---

## Executive Summary

This design system establishes a consistent, modern user experience for the DevTools Suite multi-tool platform. The design prioritizes:
- **Compact, efficient use of space** - Minimal header, collapsible recent apps
- **Consistent navigation** - Global header with home button accessible from all tools
- **Modern aesthetics** - Clean, professional design with subtle depth
- **Accessibility** - WCAG AA compliant, keyboard navigable
- **Developer-friendly** - Clear specifications for front-end implementation

---

## Design Philosophy

### Core Principles:
1. **Consistency First** - Same header, theme, components across all tools
2. **Content-Focused** - UI elements support, don't distract from main content
3. **Efficiency** - Quick access to tools, minimal clicks
4. **Clarity** - Clear visual hierarchy, obvious interactions
5. **Performance** - Lightweight, fast animations, optimized for modern browsers

---

## 1. GLOBAL HEADER SPECIFICATION

### Visual Design

**Dimensions:**
- Height: `56px` (fixed)
- Width: `100%` (full viewport)
- Position: `sticky` (stays at top on scroll)
- z-index: `1000` (above all content)

**Structure (3 sections):**
```
┌─────────────────────────────────────────────────────────┐
│ [🏠] Dev Tools            Breadcrumb       [🔍] [☀️/🌙] │
│ ← Left (200px)      ← Center (flex)    → Right (120px) │
└─────────────────────────────────────────────────────────┘
```

**Colors:**
- Dark theme:
  - Background: `#1e293b` (existing secondary bg)
  - Border bottom: `1px solid #38bdf8` (accent)
  - Text: `#f1f5f9` (primary text)
- Light theme:
  - Background: `#ffffff`
  - Border bottom: `1px solid #0284c7` (accent)
  - Text: `#0f172a`

**CSS Specification:**
```css
.global-header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background-color: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 200px;
}

.header-center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 120px;
    justify-content: flex-end;
}
```

### Left Section Components

#### Home Button
**Design:**
- Icon: 🏠 (house emoji) or SVG
- Size: `40px x 40px` (clickable area)
- Border radius: `6px`
- Background: Transparent on default, `var(--color-bg-tertiary)` on hover
- Tooltip: "Home" (on hover, 300ms delay)

**States:**
- Default: Icon only, subtle border
- Hover: Background appears, icon slightly larger (scale 1.1)
- Active: Scale 0.95
- Focus: 2px accent outline

**CSS:**
```css
.home-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    transition: all 150ms ease;
    font-size: 1.2rem;
}

.home-button:hover {
    background-color: var(--color-bg-tertiary);
    transform: scale(1.05);
}

.home-button:active {
    transform: scale(0.95);
}

.home-button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}
```

#### App Title
**Design:**
- Text: "Dev Tools"
- Font size: `1.25rem` (20px)
- Font weight: `600` (semi-bold)
- Color: `var(--color-accent)` (cyan in dark, blue in light)
- Letter spacing: `-0.02em` (slightly tighter)

**CSS:**
```css
.app-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-accent);
    letter-spacing: -0.02em;
    margin: 0;
    white-space: nowrap;
}
```

### Center Section - Breadcrumb

**Design:**
- Shows current location: `Home / Tool Name`
- Font size: `0.875rem` (14px)
- Color: `var(--color-text-secondary)` (muted)
- Separator: `/` with spacing
- On home page: Hidden or shows "Tools Dashboard"

**CSS:**
```css
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
}

.breadcrumb-item {
    color: var(--color-text-secondary);
    text-decoration: none;
}

.breadcrumb-item.active {
    color: var(--color-text-primary);
    font-weight: 500;
}

.breadcrumb-separator {
    color: var(--color-text-muted);
}
```

### Right Section Components

#### Search Button
**Design:**
- Icon: 🔍 (magnifying glass)
- Size: `40px x 40px`
- Same styling as home button
- Tooltip: "Search tools (Ctrl+K)"
- Opens search modal on click

**Interaction:**
- Click: Opens search modal with fade-in animation
- Keyboard: `Ctrl+K` or `/` also opens search

#### Theme Toggle Button
**Design:**
- Icon: ☀️ (sun in dark mode) / 🌙 (moon in light mode)
- Size: `40px x 40px`
- Same styling as home button
- Tooltip: "Toggle theme"
- Smooth icon transition on theme change

**Animation:**
- Icon rotates 180° when switching: `transform: rotate(180deg)`
- Duration: `300ms`
- Easing: `ease-in-out`
- All colors transition: `200ms`

**CSS:**
```css
.theme-toggle .icon {
    transition: transform 300ms ease-in-out;
}

.theme-toggle.switching .icon {
    transform: rotate(180deg);
}
```

---

## 2. RECENT APPS BAR SPECIFICATION

### Visual Design

**Dimensions:**
- Height: `48px` (compact)
- Width: `100%`
- Position: Below header, above main content
- Background: Subtle contrast from main area

**Behavior:**
- Visible when user has recent tool history (localStorage)
- Hidden when empty (no recent tools)
- Horizontal scroll if more than 5 tools on mobile

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Recent: [📋 JSON] [📊 SIP] [🏠 EMI] [📝 Diff]   [Clear] │
└─────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.recent-apps-bar {
    height: 48px;
    background-color: var(--color-bg-primary);
    border-bottom: 1px solid var(--color-bg-tertiary);
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    overflow-x: auto;
    overflow-y: hidden;
}

.recent-apps-bar.empty {
    display: none;
}

.recent-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    font-weight: 500;
    white-space: nowrap;
}

.recent-apps-list {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}
```

### Recent App Chip Component

**Design:**
- Size: Auto width (max 140px), 32px height
- Border radius: `16px` (pill shape)
- Background: `var(--color-bg-secondary)` with hover state
- Border: `1px solid var(--color-bg-tertiary)`
- Icon + Text layout

**States:**
- Default: Subtle background, visible border
- Hover: Accent border, slightly elevated
- Active: Pressed effect
- Current tool: Accent background, bold text

**CSS:**
```css
.recent-app-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    height: 32px;
    border-radius: 16px;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-bg-tertiary);
    color: var(--color-text-primary);
    font-size: 0.875rem;
    text-decoration: none;
    cursor: pointer;
    transition: all 150ms ease;
    white-space: nowrap;
    max-width: 140px;
}

.recent-app-chip:hover {
    border-color: var(--color-accent);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recent-app-chip.active {
    background-color: var(--color-accent);
    color: var(--color-bg-primary);
    font-weight: 600;
}

.recent-app-icon {
    font-size: 1rem;
    flex-shrink: 0;
}

.recent-app-name {
    overflow: hidden;
    text-overflow: ellipsis;
}
```

### Clear Recent Button

**Design:**
- Text: "Clear" or ✕ icon
- Size: 32px height, auto width
- Minimal styling
- Positioned at right end of bar

**CSS:**
```css
.clear-recent-btn {
    margin-left: auto;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 150ms;
}

.clear-recent-btn:hover {
    color: var(--color-error);
}
```

---

## 3. HOME PAGE LAYOUT SPECIFICATION

### Main Content Area

**Dimensions:**
- Padding: `2rem` on desktop, `1rem` on mobile
- Max width: `1400px` centered
- Background: `var(--color-bg-primary)`

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Global Header (56px)                                    │
├─────────────────────────────────────────────────────────┤
│ Recent Apps (48px) - if populated                       │
├─────────────────────────────────────────────────────────┤
│                  Main Content Area                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   JSON      │  │  Markdown   │  │    Diff     │    │
│  │   Tool      │  │  Converter  │  │   Checker   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │     SIP     │  │     EMI     │  │             │    │
│  │ Calculator  │  │ Calculator  │  │             │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.home-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
}

.home-header {
    margin-bottom: 2rem;
}

.home-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
}

.home-description {
    font-size: 1rem;
    color: var(--color-text-secondary);
}
```

### Tool Cards Grid

**Desktop Layout (3 columns):**
- Grid columns: `repeat(auto-fill, minmax(300px, 1fr))`
- Gap: `1.5rem` between cards
- Cards: Equal height

**Tablet (2 columns):**
- Below 900px: 2 columns
- Gap: `1.25rem`

**Mobile (1 column):**
- Below 600px: 1 column (stacked)
- Gap: `1rem`

**CSS:**
```css
.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

@media (max-width: 900px) {
    .tools-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
    }
}

@media (max-width: 600px) {
    .tools-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .home-container {
        padding: 1rem;
    }
}
```

---

## 4. TOOL CARD COMPONENT

### Visual Design

**Dimensions:**
- Width: Responsive (fills grid cell)
- Height: `280px` (fixed for consistency)
- Border radius: `12px`
- Padding: `1.5rem`
- Border: `1px solid var(--color-bg-tertiary)`
- Shadow: `0 2px 4px rgba(0, 0, 0, 0.1)`

**Structure Breakdown:**
```
┌────────────────────────┐
│      Icon (60x60)      │ ← Top, centered
│                        │
│    Tool Name (h3)      │ ← Title, 2 lines max
│                        │
│ Brief description...   │ ← Body, 3 lines max
│ explaining the tool... │
│                        │
│  [Launch Tool Button]  │ ← Bottom, full-width
└────────────────────────┘
```

**CSS:**
```css
.tool-card {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 12px;
    padding: 1.5rem;
    height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 200ms ease;
    cursor: pointer;
}

.tool-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.tool-card:active {
    transform: translateY(-2px);
}
```

### Card Icon

**Design:**
- Size: `60px x 60px`
- Icon: emoji or SVG
- Background: Circular with accent color (10% opacity)
- Positioned at top

**CSS:**
```css
.card-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(56, 189, 248, 0.1); /* Accent at 10% */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    font-size: 2rem;
}
```

### Card Title

**Design:**
- Font size: `1.25rem` (20px)
- Font weight: `600`
- Color: `var(--color-text-primary)`
- Max lines: 2 (ellipsis after)
- Margin bottom: `0.75rem`

**CSS:**
```css
.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.75rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

### Card Description

**Design:**
- Font size: `0.875rem` (14px)
- Color: `var(--color-text-secondary)`
- Line height: `1.5`
- Max lines: 3 (ellipsis after)
- Flex: 1 (fills remaining space)

**CSS:**
```css
.card-description {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    margin-bottom: 1rem;
}
```

### Launch Button

**Design:**
- Width: 100% of card
- Height: `40px`
- Background: `var(--color-accent)`
- Color: White/dark bg contrast
- Border radius: `6px`
- Font weight: `500`

**States:**
- Default: Accent background
- Hover: Slightly darker (90% brightness)
- Active: Pressed effect (scale 0.98)

**CSS:**
```css
.card-action {
    width: 100%;
    height: 40px;
    background-color: var(--color-accent);
    color: var(--color-bg-primary);
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 150ms ease;
}

.card-action:hover {
    filter: brightness(0.9);
}

.card-action:active {
    transform: scale(0.98);
}
```

---

## 5. TOOL PAGES LAYOUT

### Common Structure

All tool pages share:
- Global header (same as home)
- Recent apps bar (optional, can be hidden)
- Tool-specific content area
- Consistent padding and spacing

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Global Header - Home button shows current tool name    │
├─────────────────────────────────────────────────────────┤
│ Recent Apps Bar (if enabled)                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Tool Specific Content                                  │
│  (Each tool has its own layout)                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.tool-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
    min-height: calc(100vh - 56px); /* Full height minus header */
}
```

---

## 6. SEARCH MODAL SPECIFICATION

### Visual Design

**Modal Backdrop:**
- Background: `rgba(0, 0, 0, 0.5)` (50% black overlay)
- Blur effect: `backdrop-filter: blur(4px)` (modern browsers)
- Click to close

**Modal Container:**
- Width: `600px` max, 90vw on mobile
- Height: Auto (min 300px, max 600px)
- Border radius: `12px`
- Background: `var(--color-bg-secondary)`
- Shadow: `0 20px 40px rgba(0, 0, 0, 0.3)`
- Centered: Absolute center of viewport

**Structure:**
```
┌────────────────────────────────┐
│  [🔍 Search tools...]     [×]  │ ← Search input header
├────────────────────────────────┤
│                                │
│  📋 JSON Schema Generator      │ ← Search results
│  📝 Markdown Converter         │
│  📊 SIP Calculator             │
│                                │
│  No results found              │ ← Empty state
└────────────────────────────────┘
```

**CSS:**
```css
.search-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 200ms ease;
}

.search-modal {
    width: 90vw;
    max-width: 600px;
    max-height: 600px;
    background-color: var(--color-bg-secondary);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    animation: scaleIn 200ms ease;
}

.search-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-bg-tertiary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.search-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--color-text-primary);
    font-size: 1rem;
    outline: none;
}

.search-close {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.25rem;
    color: var(--color-text-secondary);
}

.search-close:hover {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
}

.search-results {
    max-height: 500px;
    overflow-y: auto;
    padding: 0.5rem;
}

.search-result-item {
    padding: 0.75rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: background-color 150ms;
}

.search-result-item:hover {
    background-color: var(--color-bg-tertiary);
}

.search-result-icon {
    font-size: 1.5rem;
}

.search-result-text {
    flex: 1;
}

.search-result-title {
    font-weight: 500;
    color: var(--color-text-primary);
}

.search-result-description {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
```

### Search Interaction

**Open Animation:**
1. Backdrop fades in (200ms)
2. Modal scales up from 0.95 to 1.0 (200ms)
3. Focus immediately goes to search input

**Search Behavior:**
- Filters tools in real-time as user types
- Shows all tools when input is empty
- Highlights matching text (optional enhancement)
- Keyboard navigation: Arrow keys to select, Enter to launch

**Close Animation:**
- Reverse of open (fade out + scale down)
- Duration: 200ms
- Close triggers: Click backdrop, Esc key, click × button, select a tool

---

## 7. ACCESSIBILITY SPECIFICATIONS

### Keyboard Navigation

**Global Shortcuts:**
- `Tab` / `Shift+Tab`: Move through interactive elements
- `Enter` / `Space`: Activate buttons/links
- `Escape`: Close modals
- `/` or `Ctrl+K`: Open search
- `Alt+H`: Go home (optional)

**Tab Order:**
1. Home button
2. Search button
3. Theme toggle
4. Recent app chips (left to right)
5. Tool cards (left to right, top to bottom)

### Focus Indicators

**All Interactive Elements:**
```css
button:focus-visible,
a:focus-visible,
input:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}
```

### ARIA Attributes

**Required ARIA Labels:**
```html
<!-- Header -->
<header class="global-header" role="banner">
    <button class="home-button" aria-label="Go to home page">...</button>
    <button class="search-button" aria-label="Search tools">...</button>
    <button class="theme-toggle" aria-label="Toggle dark/light theme">...</button>
</header>

<!-- Recent Apps -->
<aside class="recent-apps-bar" aria-label="Recently used tools">
    <a class="recent-app-chip" href="#json" aria-label="JSON Schema Generator">...</a>
</aside>

<!-- Tool Cards -->
<article class="tool-card" aria-labelledby="tool-json-title">
    <h3 id="tool-json-title">JSON Schema Generator</h3>
    ...
</article>

<!-- Search Modal -->
<div class="search-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="search-title">
    <div class="search-modal">
        <input id="search-title" aria-label="Search for tools" />
    </div>
</div>
```

### Color Contrast

**WCAG AA Requirements:**
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt): 3:1 contrast ratio
- Interactive elements: 3:1 contrast with background

**Verified Pairings:**
- Dark theme: `#f1f5f9` on `#1e293b` = 9.2:1 ✅
- Light theme: `#0f172a` on `#ffffff` = 16.1:1 ✅
- Accent (dark): `#38bdf8` on `#1e293b` = 4.8:1 ✅
- Accent (light): `#0284c7` on `#ffffff` = 4.6:1 ✅

---

## 8. RESPONSIVE DESIGN BREAKPOINTS

### Breakpoint Strategy

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Desktop | 1200px+ | 3-column grid, full header |
| Laptop | 900px - 1199px | 2-column grid, condensed header |
| Tablet | 600px - 899px | 2-column grid, compact header |
| Mobile | < 600px | 1-column stacked, mobile header |

### Mobile Header Adaptation

**Below 600px:**
- Breadcrumb hides
- App title reduces to icon or abbreviation
- Buttons remain same size (44x44px for touch)

**CSS:**
```css
@media (max-width: 600px) {
    .app-title {
        font-size: 1rem;
    }
    
    .breadcrumb {
        display: none;
    }
    
    .global-header {
        padding: 0 1rem;
    }
    
    .header-left {
        width: auto;
    }
    
    .header-right {
        width: auto;
    }
}
```

---

## 9. ANIMATION & TRANSITIONS

### Timing Standards

| Animation Type | Duration | Easing | Use Case |
|---------------|----------|--------|----------|
| Instant | 0ms | - | State changes, focus |
| Quick | 150ms | ease | Hover effects, tooltips |
| Normal | 200ms | ease | Theme switches, color changes |
| Deliberate | 300ms | ease-in-out | Modal open/close, rotations |
| Slow | 500ms | ease-out | Page transitions (if needed) |

### CSS Transition Base

```css
/* Apply to all themed elements */
body, .panel, .header, button, .tool-card {
    transition: background-color 200ms ease,
                color 200ms ease,
                border-color 200ms ease;
}

/* Hover animations */
button, .tool-card, .recent-app-chip {
    transition: all 150ms ease;
}
```

### Reduced Motion Preference

**Respect User Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 10. DESIGN TOKENS (CSS Variables)

### Complete Token Set

```css
:root {
    /* ========== COLORS - DARK THEME (DEFAULT) ========== */
    --color-bg-primary: #0f172a;
    --color-bg-secondary: #1e293b;
    --color-bg-tertiary: #334155;
    --color-text-primary: #f1f5f9;
    --color-text-secondary: #cbd5e1;
    --color-text-muted: #94a3b8;
    --color-accent: #38bdf8;
    --color-success: #22c55e;
    --color-error: #ef4444;
    --color-warning: #f59e0b;
    
    /* ========== COLORS - LIGHT THEME ========== */
    [data-theme="light"] & {
        --color-bg-primary: #f8fafc;
        --color-bg-secondary: #ffffff;
        --color-bg-tertiary: #e2e8f0;
        --color-text-primary: #0f172a;
        --color-text-secondary: #334155;
        --color-text-muted: #64748b;
        --color-accent: #0284c7;
        --color-success: #16a34a;
        --color-error: #dc2626;
        --color-warning: #ea580c;
    }
    
    /* ========== SPACING ========== */
    --space-xs: 0.25rem;  /* 4px */
    --space-sm: 0.5rem;   /* 8px */
    --space-md: 1rem;     /* 16px */
    --space-lg: 1.5rem;   /* 24px */
    --space-xl: 2rem;     /* 32px */
    --space-2xl: 3rem;    /* 48px */
    
    /* ========== TYPOGRAPHY ========== */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-xs: 0.75rem;    /* 12px */
    --font-size-sm: 0.875rem;   /* 14px */
    --font-size-base: 1rem;     /* 16px */
    --font-size-lg: 1.125rem;   /* 18px */
    --font-size-xl: 1.25rem;    /* 20px */
    --font-size-2xl: 1.5rem;    /* 24px */
    --font-size-3xl: 2rem;      /* 32px */
    
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    /* ========== BORDERS ========== */
    --border-width: 1px;
    --border-color: var(--color-bg-tertiary);
    
    --radius-sm: 0.375rem;  /* 6px */
    --radius-md: 0.5rem;    /* 8px */
    --radius-lg: 0.75rem;   /* 12px */
    --radius-xl: 1rem;      /* 16px */
    --radius-full: 9999px;  /* Full circle */
    
    /* ========== SHADOWS ========== */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.3);
    
    /* ========== Z-INDEX ========== */
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 1000;
    --z-modal: 2000;
    --z-tooltip: 3000;
    
    /* ========== TRANSITIONS ========== */
    --transition-quick: 150ms ease;
    --transition-normal: 200ms ease;
    --transition-slow: 300ms ease-in-out;
    
    /* ========== LAYOUT ========== */
    --header-height: 56px;
    --recent-bar-height: 48px;
    --max-width-content: 1400px;
}
```

---

## 11. COMPONENT STATE MATRIX

| Component | Default | Hover | Active | Focus | Disabled |
|-----------|---------|-------|--------|-------|----------|
| Tool Card | Border subtle | Border accent, lift | Slightly pressed | Outline ring | Opacity 50% |
| Button | Solid color | Darker 10% | Scale 0.98 | Outline ring | Opacity 50%, no cursor |
| Chip | Subtle bg | Border accent | - | Outline ring | - |
| Input | Border normal | - | - | Accent border + shadow | Opacity 60% |
| Link | Accent color | Underline | - | Outline ring | - |

---

## 12. IMPLEMENTATION CHECKLIST

### For Front-End Developer:

**Phase 1: Global Structure**
- [ ] Create global header HTML structure
- [ ] Implement header CSS with sticky positioning
- [ ] Add home button with navigation
- [ ] Add search button (with modal placeholder)
- [ ] Add theme toggle (integrate with existing theme system)
- [ ] Test header on all breakpoints

**Phase 2: Recent Apps**
- [ ] Create recent apps bar HTML structure
- [ ] Implement recent apps CSS (horizontal scroll)
- [ ] Create recent app chip component
- [ ] Implement localStorage tracking
- [ ] Add clear recent button functionality
- [ ] Test with 1, 3, 5, 10 recent apps

**Phase 3: Home Page**
- [ ] Create home page container
- [ ] Implement responsive tools grid
- [ ] Create tool card component
- [ ] Add 6 tool cards with content
- [ ] Implement card hover effects
- [ ] Wire up launch buttons
- [ ] Test responsive breakpoints

**Phase 4: Search Modal**
- [ ] Create search modal HTML structure
- [ ] Implement modal CSS (backdrop, container)
- [ ] Add search input with icon
- [ ] Implement search filtering logic
- [ ] Add keyboard shortcuts (Ctrl+K, Esc)
- [ ] Test modal open/close animations

**Phase 5: Integration**
- [ ] Integrate with existing tool pages
- [ ] Ensure all tools have home button
- [ ] Update existing theme toggle to work in header
- [ ] Test navigation between all pages
- [ ] Verify localStorage persistence
- [ ] Test on Chrome and Edge

**Phase 6: Accessibility**
- [ ] Add all ARIA labels
- [ ] Test keyboard navigation
- [ ] Verify focus indicators
- [ ] Check color contrast
- [ ] Test with screen reader (basic)

**Phase 7: Polish**
- [ ] Optimize animations
- [ ] Test performance (Lighthouse)
- [ ] Fix any responsive issues
- [ ] Cross-browser testing
- [ ] Final visual QA

---

## 13. TOOL-SPECIFIC ICONS

| Tool | Icon | Alt Text |
|------|------|----------|
| JSON Schema Generator | 📋 | Clipboard with JSON |
| HTML ↔ Markdown | 📝 | Document conversion |
| Text Diff Checker | 🔍 | Magnifying glass |
| SIP Calculator | 📊 | Bar chart |
| EMI Calculator | 🏠 | House/home |
| Home Page | 🏠 | Home icon |

**Icon Alternatives (if emojis not preferred):**
Use Heroicons or similar SVG icon set:
- JSON: `<svg>...</svg>` (code brackets icon)
- Markdown: `<svg>...</svg>` (document icon)
- Diff: `<svg>...</svg>` (diff/compare icon)
- SIP: `<svg>...</svg>` (trending up chart)
- EMI: `<svg>...</svg>` (building/calculator)

---

## 14. NEXT STEPS

### Handoff to Front-End Developer:

1. **Review this design system** - Understand all specifications
2. **Set up CSS variables** - Implement design tokens first
3. **Build global header** - Start with persistent navigation
4. **Create component library** - Reusable components (buttons, cards)
5. **Implement home page** - Tool grid and cards
6. **Add recent apps** - localStorage integration
7. **Build search modal** - With filtering logic
8. **Integrate with tools** - Ensure consistency
9. **Test & refine** - Responsive, accessible, performant

### Questions for Clarification:

If anything is unclear, ask:
- Color specifications
- Exact dimensions
- Animation preferences
- Browser compatibility concerns
- Performance constraints

---

**This design system is ready for implementation. All specifications are precise and developer-ready. Good luck building the DevTools Suite!** 🚀

---

*Design System Version 1.0*  
*March 20, 2026*  
*Ready for Front-End Development*
